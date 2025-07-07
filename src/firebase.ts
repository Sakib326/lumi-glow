// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDT_KzoIZikCPyIDfyfTepsjKQiL1ayS2I",
  authDomain: "lumi-glow.firebaseapp.com",
  projectId: "lumi-glow",
  storageBucket: "lumi-glow.firebasestorage.app",
  messagingSenderId: "163287384558",
  appId: "1:163287384558:web:62d412ef8c519146b70eff",
  measurementId: "G-85KWNL08GP"
};

const app = initializeApp(firebaseConfig);

// Auth services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
