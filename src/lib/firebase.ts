// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
apiKey: "AIzaSyAL0VJaa61nr77x_Qwp2ZBEzqYnXct5z1g",
  authDomain: "study-battle-royale.firebaseapp.com",
  projectId: "study-battle-royale",
  storageBucket: "study-battle-royale.firebasestorage.app",
databaseURL: "https://study-battle-royale-default-rtdb.firebaseio.com",
  messagingSenderId: "965107986792",
  appId: "1:965107986792:web:cd7ec96684203f928c66dd",
  measurementId: "G-77X0G0QG5G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();