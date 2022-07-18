// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBme7fJeRke-CkmEx6ECPvPGo9asTiIRYk",
  authDomain: "js-canvas-game.firebaseapp.com",
  projectId: "js-canvas-game",
  databaseURL:
    "https://js-canvas-game-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "js-canvas-game.appspot.com",
  messagingSenderId: "685221801206",
  appId: "1:685221801206:web:e9added9d1e83b6a7ad0d7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Init Realtime database
export const database = getDatabase(app);
// Init auth
export const auth = getAuth();
