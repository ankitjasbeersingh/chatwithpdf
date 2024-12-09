// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAboOkr0fog1raNrzgDA0HoQvY1Mf3-ZAQ",
  authDomain: "chat-with-pdf-bef68.firebaseapp.com",
  projectId: "chat-with-pdf-bef68",
  storageBucket: "chat-with-pdf-bef68.firebasestorage.app",
  messagingSenderId: "558403755223",
  appId: "1:558403755223:web:b29a57f0827f64fa11a492"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export {db};