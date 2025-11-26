// src/pages/Lobby.tsx
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { rtdb } from "../lib/firebase";
import { ref, update } from "firebase/database";


const SUBJECTS = [
  { name: "Mathematics", emoji: "π", color: "from-purple-600 to-pink-600" },
  { name: "History", emoji: "🏛️", color: "from-amber-600 to-orange-700" },
  { name: "Biology", emoji: "🧬", color: "from-green-600 to-emerald-700" },
  { name: "Physics", emoji: "⚡", color: "from-blue-600 to-cyan-600" },
  { name: "Chemistry", emoji: "⚗️", color: "from-red-600 to-rose-700" },
  { name: "Literature", emoji: "📚", color: "from-indigo-600 to-purple-700" },
];

export default function Lobby() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);

const quickMatch = async () => {
  if (!selectedSubject || !user || matching) return;
  setMatching(true);

  // Use a real room in Firebase
  const roomRef = ref(rtdb, `arenas/demo-room-123`);
  await update(roomRef, {
    subject: selectedSubject,
    state: "waiting",
    countdown: 10,
  });

  // Join player
  await update(ref(rtdb, `arenas/demo-room-123/players/${user.uid}`), {
    uid: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "Player",
    photo: user.photoURL || "",
    score: 0,
    alive: true,
  });

  // Go to arena
  navigate("/arena/demo-room-123");
};

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-black text-center mb-4 animate-bounceIn">
          CHOOSE YOUR BATTLEGROUND
        </h1>
        <p className="text-xl text-center text-indigo-300 mb-12">
          First to 3 players = instant war
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16">
          {SUBJECTS.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelectedSubject(s.name)}
              className={`relative overflow-hidden rounded-3xl p-12 transition-all transform hover:scale-105 ${
                selectedSubject === s.name
                  ? "ring-8 ring-white/80 shadow-2xl scale-105"
                  : "opacity-80"
              }`}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${s.color} opacity-90`} />
              <div className="relative z-10 text-center">
                <div className="text-8xl mb-4">{s.emoji}</div>
                <div className="text-3xl font-bold">{s.name}</div>
              </div>
              {selectedSubject === s.name && (
                <div className="absolute top-4 right-4 text-6xl animate-pulse">
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={quickMatch}
            disabled={!selectedSubject || matching}
            className="relative px-24 py-8 text-5xl font-black rounded-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110 shadow-2xl"
          >
            {matching ? (
              <span className="flex items-center gap-4 justify-center">
                <div className="animate-spin h-12 w-12 border-8 border-white rounded-full border-t-transparent" />
                FINDING WORTHY OPPONENTS...
              </span>
            ) : (
              "QUICK MATCH Sword"
            )}
          </button>
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => auth.signOut()}
            className="text-indigo-300 hover:text-white underline"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}