// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp_QOqO7LUb5YazM_sfxrAC6ZF-ZLv_f8",
  authDomain: "prepwise-f2f5f.firebaseapp.com",
  projectId: "prepwise-f2f5f",
  storageBucket: "prepwise-f2f5f.firebasestorage.app",
  messagingSenderId: "929717611875",
  appId: "1:929717611875:web:e1a81027d07713bf3ff756",
  measurementId: "G-YPQTCN928V"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp() ;
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);  