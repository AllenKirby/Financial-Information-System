import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBIzbZigyXE9ky5J2dTRsurw5AqBvKsE_Q",
  authDomain: "financial-information-system.firebaseapp.com",
  projectId: "financial-information-system",
  storageBucket: "financial-information-system.appspot.com",
  messagingSenderId: "308788090578",
  appId: "1:308788090578:web:5e167d0d78bc8dcc437f0b",
  measurementId: "G-RXTPH0DS3P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)