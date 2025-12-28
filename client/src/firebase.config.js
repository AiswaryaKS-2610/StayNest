import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCxp-X3yonTaDpaqSY9PQVubs75tkQIciw",
    authDomain: "staynest-10efe.firebaseapp.com",
    projectId: "staynest-10efe",
    storageBucket: "staynest-10efe.firebasestorage.app",
    messagingSenderId: "43207116386",
    appId: "1:43207116386:web:d086629352a4e64814b33b",
    measurementId: "G-BZHPD26N2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Note: Storage is now handled by Cloudinary
