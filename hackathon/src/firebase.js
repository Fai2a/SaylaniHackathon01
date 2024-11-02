// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAty6P-EvAgH73D9vlGGzb02pWljxBo0L4",
  authDomain: "ppointment-da252.firebaseapp.com",
  projectId: "ppointment-da252",
  storageBucket: "ppointment-da252.firebasestorage.app",
  messagingSenderId: "66049441503",
  appId: "1:66049441503:web:5cda359de841316416336a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
