// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "js-canvas-game.firebaseapp.com",
  projectId: "js-canvas-game",
  databaseURL:
    "https://js-canvas-game-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "js-canvas-game.appspot.com",
  messagingSenderId: "685221801206",
  appId: process.env.REACT_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Init Realtime database
export const database = getDatabase(app);
// Init auth
export const auth = getAuth();
