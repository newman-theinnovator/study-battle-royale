// src/pages/Landing.tsx
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle returning from magic link
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let savedEmail = window.localStorage.getItem("emailForSignIn");
      if (!savedEmail) {
        savedEmail = window.prompt("Confirm your email to complete login:");
      }
      if (savedEmail) {
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(() => {
            window.localStorage.removeItem("emailForSignIn");
            setMessage("Logged in successfully! 🎉");
          })
          .catch((error) => {
            console.error("Magic link error:", error);
            setMessage(`Login failed: ${error.message}`);
          });
      }
    }
  }, []);

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setMessage(`Google login failed: ${error.message}`);
    }
  };

  const handleMagicLink = async () => {
    if (!email.includes("@")) {
      setMessage("Please enter a valid email");
      return;
    }

    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin,
        handleCodeInApp: true,
      });
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("Check your email for the magic link! (Also check spam)");
    } catch (error: any) {
      console.error("Magic link send error:", error);
      setMessage(`Failed: ${error.code || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-bounceIn">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-5xl font-black text-white text-center mb-2">
            Study Battle Royale
          </h1>
          <p className="text-indigo-200 text-center mb-8">
            Last one standing aces the exam
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="student@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-indigo-300 text-white focus:outline-none focus:border-white"
            />

            <button
              onClick={handleGoogle}
              className="w-full bg-white text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-3"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="h-5" />
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-linear-to-br from-purple-900 to-indigo-900 text-indigo-300">or</span>
              </div>
            </div>

            <button onClick={handleMagicLink} className="w-full btn-primary text-xl">
              Send Magic Login Link
            </button>

            {message && (
              <p className={`text-center text-sm mt-4 ${message.includes("Check") ? "text-green-400" : "text-yellow-300"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}