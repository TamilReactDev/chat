import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

import { getStorage} from "firebase/storage";


const firebaseConfig = {
  apiKey: 'AIzaSyBxmWRZ-WH4Skk4Gfh5Ao-tFdNWYDEEs-w',
  authDomain: "blog-e0c2d.firebaseapp.com",
  projectId: "blog-e0c2d",
  storageBucket: "blog-e0c2d.appspot.com",
  messagingSenderId: "582247283363",
  appId: "1:582247283363:web:a3e023b3e1610acb109d16",
  measurementId: "G-Y1TWH53MCQ"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
