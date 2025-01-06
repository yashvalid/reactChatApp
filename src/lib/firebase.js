import {getAuth} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapp-d17f5.firebaseapp.com",
  projectId: "reactchatapp-d17f5",
  storageBucket: "reactchatapp-d17f5.firebasestorage.app",
  messagingSenderId: "78483312709",
  appId: "1:78483312709:web:74fc0e5d89aaf2cf7cd32c",
  measurementId: "G-PHKWBM0PJQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
