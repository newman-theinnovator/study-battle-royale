import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
// import { playSound } from "../components/SoundPlayer";

export default function Dashboard() {
  const user = auth.currentUser!;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Welcome back, {user.displayName || user.email}!</h1>
          <button
            onClick={() => signOut(auth)}
            className="bg-danger/80 hover:bg-danger px-6 py-3 rounded-lg font-bold"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center hover:scale-105 transition">
            <h2 className="text-6xl mb-4">🏆</h2>
            <p className="text-2xl font-bold">0 Wins</p>
            <p className="text-indigo-300">Time to dominate</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center hover:scale-105 transition">
            <h2 className="text-6xl mb-4">🔥</h2>
            <p className="text-2xl font-bold">0 Streak</p>
            <p className="text-indigo-300">Start a battle!</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center hover:scale-105 transition">
            <h2 className="text-6xl mb-4">⚔️</h2>
            <p className="text-2xl font-bold">Quick Match</p>
           <button
  onClick={() => window.location.href = "/lobby"}
  className="mt-4 btn-primary text-2xl px-12"
>
  ENTER ARENA
</button>
          </div>
        </div>
      </div>
    </div>
  );
}