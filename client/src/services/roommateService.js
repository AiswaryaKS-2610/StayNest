import { db } from '../firebase.config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'roommates';

export const addRoommateProfile = async (profileData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...profileData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding roommate profile: ", error);
        throw error;
    }
};

export const getRoommates = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching roommates: ", error);
        throw error;
    }
};
