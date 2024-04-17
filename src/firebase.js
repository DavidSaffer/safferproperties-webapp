// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOnuxvnyr8MA0fY07uXLzSzc5kTTBArS8",
  authDomain: "safferproperties-6bead.firebaseapp.com",
  projectId: "safferproperties-6bead",
  storageBucket: "safferproperties-6bead.appspot.com",
  messagingSenderId: "46183958382",
  appId: "1:46183958382:web:74773a629c721c1b48a37f",
  measurementId: "G-9NFY4Y4T8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);