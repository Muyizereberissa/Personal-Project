import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBbQWSxlvnfCaxJeXBt88RWjv7mebLZ77c",
    authDomain: "login-react-1a495.firebaseapp.com",
    projectId: "login-react-1a495",
    storageBucket: "login-react-1a495.appspot.com",
    messagingSenderId: "744362710480",
    appId: "1:744362710480:web:8c4c4add03d4a571f0d5d5",
    measurementId: "G-ZCCQFPSP70"
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const FIREBASE_DB = getFirestore(app);