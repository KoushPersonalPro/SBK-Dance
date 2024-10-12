// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDpo8g3JGmUHyQcLajC_41i47Q89Whfi5M",
  authDomain: "sbk-dance-afb6e.firebaseapp.com",
  projectId: "sbk-dance-afb6e",
  storageBucket: "sbk-dance-afb6e.appspot.com",
  messagingSenderId: "867822502903",
  appId: "1:867822502903:web:7aee60dda517e5544b64f2",
  measurementId: "G-PY6WGYNX6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, db, auth, storage, firestore };