const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
require('dotenv').config({ path: '../.env' });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const titlesToDelete = [
    "Cozy Cottage in Galway",
    "Modern Apartment in Limerick City"
];

const deleteListings = async () => {
    try {
        const batch = db.batch();
        let deletedCount = 0;

        for (const title of titlesToDelete) {
            const snapshot = await db.collection('listings')
                .where('title', '==', title)
                .get();

            if (snapshot.empty) {
                console.log(`No listing found with title: "${title}"`);
                continue;
            }

            snapshot.forEach(doc => {
                batch.delete(doc.ref);
                deletedCount++;
                console.log(`Marked for deletion: "${title}" [ID: ${doc.id}]`);
            });
        }

        if (deletedCount > 0) {
            await batch.commit();
            console.log(`Successfully deleted ${deletedCount} listings.`);
        } else {
            console.log('No listings were deleted.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error deleting listings:', error);
        process.exit(1);
    }
};

deleteListings();
