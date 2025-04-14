import {getAuth} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactrealtimechat-380d7.firebaseapp.com",
  projectId: "reactrealtimechat-380d7",
  storageBucket: "reactrealtimechat-380d7.firebasestorage.app",
  messagingSenderId: "790358212818",
  appId: "1:790358212818:web:57cebcf809678b50f22d0b",
  measurementId: "G-RYTPP23FBW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
