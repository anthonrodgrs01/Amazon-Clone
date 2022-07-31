import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqD1ZZiSX0EXFNZT5FfT9yd7YBHQSxAnI",
  authDomain: "clone-c44c6.firebaseapp.com",
  projectId: "clone-c44c6",
  storageBucket: "clone-c44c6.appspot.com",
  messagingSenderId: "51868972738",
  appId: "1:51868972738:web:dd1a1767bd82424b222d5b",
  measurementId: "G-XEL87BS5BV",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);

export { db, auth };
