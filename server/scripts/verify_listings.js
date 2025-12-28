const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
require('dotenv').config({ path: '../.env' });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const verifyListings = async () => {
    try {
        const snapshot = await db.collection('listings')
            .where('status', '==', 'approved')
            .get();

        if (snapshot.empty) {
            console.log('No approved listings found.');
            return;
        }

        console.log(`Found ${snapshot.size} approved listings:`);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- ${data.title} (${data.location}) [ID: ${doc.id}]`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error verifying listings:', error);
        process.exit(1);
    }
};

verifyListings();
