import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCfy0sIm6sVZh1dQN86Ppyrlv9HhTa2wI0",
    authDomain: "werky-a2729.firebaseapp.com",
    projectId: "werky-a2729",
    storageBucket: "werky-a2729.appspot.com",
    messagingSenderId: "449488700866",
    appId: "1:449488700866:web:893b9fe0f02fd5cff3425b",
    measurementId: "G-5SH8NHPRE1"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db };