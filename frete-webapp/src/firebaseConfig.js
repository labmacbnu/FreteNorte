// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC_FYTDJspOyk4hXPX0Cdj6kI7cpcKcnk",
  authDomain: "frete-norte-ufsc-blumenau.firebaseapp.com",
  projectId: "frete-norte-ufsc-blumenau",
  storageBucket: "frete-norte-ufsc-blumenau.appspot.com",
  messagingSenderId: "221683414981",
  appId: "1:221683414981:web:0be83ffd1a3707a0517dac",
  measurementId: "G-TYMDYT2Q3G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);