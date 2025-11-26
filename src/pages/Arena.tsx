// src/pages/Arena.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, rtdb } from "../lib/firebase";
import { ref, onValue, update } from "firebase/database";

interface Player {
  uid: string;
  name: string;
  score: number;
  alive: boolean;
  lastAnswer?: string | null;
}

interface Question {
  q: string;
  a: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  { q: "9 × 7 = ?", a: "63", options: ["54", "63", "72", "81"] },
  { q: "Capital of France?", a: "Paris", options: ["London", "Berlin", "Paris", "Madrid"] },
  { q: "Who wrote Romeo & Juliet?", a: "Shakespeare", options: ["Shakespeare", "Dante", "Homer", "Plato"] },
  { q: "Largest planet?", a: "Jupiter", options: ["Earth", "Mars", "Jupiter", "Saturn"] },
  { q: "H₂O is?", a: "Water", options: ["Salt", "Water", "Acid", "Sugar"] },
  { q: "E = mc² by?", a: "Einstein", options: ["Newton", "Einstein", "Tesla", "Curie"] },
  { q: "Photosynthesis produces?", a: "Glucose", options: ["CO₂", "Glucose", "Protein", "Starch"] },
  { q: "1 + 1 = ?", a: "2", options: ["1", "2", "11", "Window"] },
  { q: "Father of computers?", a: "Charles Babbage", options: ["Bill Gates", "Charles Babbage", "Steve Jobs", "Alan Turing"] },
  { q: "Pyramids are in?", a: "Egypt", options: ["Mexico", "Egypt", "China", "Peru"] },
];

const ROASTS = [
  "Skill issue detected",
  "Your GPA just filed for bankruptcy",
  "Even Siri knew that one",
  "Mom’s disappointed but not surprised",
  "Natural selection is calling",
  "ChatGPT > You",
  "Bro studied the wrong subject",
  "Eliminated faster than your motivation",
];

export default function Arena() {
  const { roomId } = useParams<{ roomId: string }>();
  const user = auth.currentUser!;
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [question, setQuestion] = useState<Question | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [gameState, setGameState] = useState<"waiting" | "countdown" | "playing" | "ended">("waiting");

  const roomRef = ref(rtdb, `arenas/${roomId}`);

  useEffect(() => {
    update(ref(rtdb, `arenas/${roomId}/players/${user.uid}`), {
      uid: user.uid,
      name: user.displayName || user.email?.split("@")[0] || "Player",
      score: 0,
      alive: true,
      lastAnswer: null,
    });

    const unsub = onValue(roomRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      setPlayers(data.players || {});
      setGameState(data.state || "waiting");
      setCountdown(data.countdown ?? 10);
      setQuestion(data.currentQuestion || null);

      const aliveCount = Object.values(data.players || {}).filter((p: any) => p.alive).length;
      if (aliveCount >= 2 && (!data.state || data.state === "waiting")) {
        update(roomRef, { state: "countdown", countdown: 10 });
      }
    });

    return () => unsub();
  }, [roomId, user]);

  useEffect(() => {
    if (countdown > 0 && gameState === "countdown") {
      const t = setTimeout(() => update(roomRef, { countdown: countdown - 1 }), 1000);
      return () => clearTimeout(t);
    }
    if (countdown === 0 && gameState === "countdown") {
      const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      update(roomRef, { state: "playing", currentQuestion: q });
    }
  }, [countdown, gameState]);

  const me = players[user.uid];
  const roast = me && !me.alive ? ROASTS[Math.floor(Math.random() * ROASTS.length)] : "";

  const answer = (choice: string) => {
    if (!question || !me?.alive || me.lastAnswer) return;

    const isCorrect = choice === question.a;

    update(ref(rtdb, `arenas/${roomId}/players/${user.uid}`), {
      lastAnswer: choice,
      alive: isCorrect,
      score: isCorrect ? (me.score || 0) + 100 : me.score || 0,
    });

    // AFTER 3 SECONDS → NEW QUESTION + RESET lastAnswer FOR ALL
    setTimeout(() => {
      onValue(roomRef, (snap) => {
        const data = snap.val();
        if (!data) return;
        const alivePlayers = Object.values(data.players || {}).filter((p: any) => p.alive);

        if (alivePlayers.length > 1) {
          const nextQ = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
          const updates: any = { currentQuestion: nextQ };

          // RESET lastAnswer FOR ALL PLAYERS
          Object.keys(data.players || {}).forEach(uid => {
            updates[`players/${uid}/lastAnswer`] = null;
          });

          update(roomRef, updates);
        } else if (alivePlayers.length === 1) {
          update(roomRef, { state: "ended" });
        }
      }, { onlyOnce: true });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-900 via-black to-purple-900 text-white flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {Object.values(players).map((p) => (
          <div key={p.uid} className={`p-6 rounded-2xl text-center ${p.alive ? "bg-white/20" : "bg-red-900/70"}`}>
            <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-2" />
            <p className="text-xl font-bold">{p.name}</p>
            <p className="text-3xl">{p.score || 0}</p>
            {!p.alive && <p className="text-red-400 text-sm">ELIMINATED</p>}
          </div>
        ))}
      </div>

      {gameState === "waiting" && <h1 className="text-8xl font-black animate-pulse">GET READY...</h1>}
      {gameState === "countdown" && <h1 className="text-9xl font-black">{countdown}</h1>}

      {gameState === "playing" && question && me?.alive && (
        <div className="animate-bounceIn text-center">
          <h2 className="text-6xl mb-16">{question.q}</h2>
          <div className="grid grid-cols-2 gap-10 max-w-5xl mx-auto">
            {question.options.map((opt) => {
              const wasChosen = me.lastAnswer === opt;
              const isCorrect = opt === question.a;
              const btnClass = wasChosen
                ? isCorrect
                  ? "bg-green-600 ring-8 ring-green-300"
                  : "bg-red-600 ring-8 ring-red-300"
                : "bg-white/20 hover:bg-white/40";

              return (
                <button
                  key={opt}
                  disabled={!!me.lastAnswer}
                  onClick={() => answer(opt)}
                  className={`py-16 text-5xl font-bold rounded-3xl transition-all ${btnClass} ${me.lastAnswer ? "cursor-not-allowed" : "hover:scale-105"}`}
                >
                  {opt}
                  {wasChosen && isCorrect && " Correct"}
                  {wasChosen && !isCorrect && " Wrong"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {me && !me.alive && (
        <div className="text-center mt-20">
          <h1 className="text-9xl font-black text-red-600 animate-bounce">ELIMINATED</h1>
          <p className="text-6xl text-yellow-400 mt-8">{roast}</p>
        </div>
      )}

      {gameState === "ended" && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center animate-bounceIn">
            <h1 className="text-9xl font-black text-yellow-400 drop-shadow-lg">
              CROWN
            </h1>
            <h2 className="text-7xl mt-8 text-white">
              {Object.values(players).find(p => p.alive)?.name || "Winner"} WINS!
            </h2>
            <button
              onClick={() => window.location.href = "/lobby"}
              className="mt-20 px-20 py-10 bg-linear-to-r from-green-500 to-emerald-600 text-6xl font-black rounded-full hover:scale-110 transition shadow-2xl"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}