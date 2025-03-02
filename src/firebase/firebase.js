// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc  } from "firebase/firestore";
import { getStorage , ref, uploadBytes, getDownloadURL  } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfy0sIm6sVZh1dQN86Ppyrlv9HhTa2wI0",
  authDomain: "werky-a2729.firebaseapp.com",
  projectId: "werky-a2729",
  storageBucket: "werky-a2729.appspot.com",
  messagingSenderId: "449488700866",
  appId: "1:449488700866:web:893b9fe0f02fd5cff3425b",
  measurementId: "G-5SH8NHPRE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth, firestore, and storage services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// Export the Firebase services
export { app, auth, db, storage ,collection, addDoc, getDocs, updateDoc, deleteDoc, doc , ref, uploadBytes, getDownloadURL}  ;
