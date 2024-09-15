// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot ,orderBy,query,
  where, getDocs,arrayUnion, arrayRemove, updateDoc, setDoc, getDoc, serverTimestamp, Timestamp
} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsHazxpZZM4uQXSJBXhVMYMQkx1SfZWek",
  authDomain: "mylife-ee495.firebaseapp.com",
  projectId: "mylife-ee495",
  storageBucket: "mylife-ee495.appspot.com",
  messagingSenderId: "1001161614415",
  appId: "1:1001161614415:web:972c6eb88f26050a49f63a",
  measurementId: "G-2MT1PRKX71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, addDoc, deleteDoc, doc, onSnapshot,orderBy ,query,
  where, getDocs,arrayUnion, arrayRemove, updateDoc, setDoc, getDoc, serverTimestamp, Timestamp
};