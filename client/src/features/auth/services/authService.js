import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase.config";

// Auth Service using Firebase
export const registerUser = async (email, password, role, fullName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send Native Firebase Verification Email
        await sendEmailVerification(user);

        // Sync with Backend
        await fetch('https://staynest-6vsv.onrender.com/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                role: role,
                fullName: fullName
            })
        });

        return user;
    } catch (error) {
        console.error("Firebase Registration Error:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'tenant';

        return { ...user, role };
    } catch (error) {
        console.error("Firebase Login Error:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
    } catch (error) {
        console.error("Firebase Logout Error:", error);
    }
};

export const getCurrentUser = () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const role = userDoc.exists() ? userDoc.data().role : 'tenant';
                resolve({ ...user, role });
            } else {
                resolve(null);
            }
        });
    });
};
