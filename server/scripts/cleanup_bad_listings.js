const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function cleanupListings() {
    try {
        console.log("Searching for listings with bad coordinates (Lat: 52.0600343)...");
        const snapshot = await db.collection('listings')
            .where('lat', '==', 52.0600343)
            .get();

        if (snapshot.empty) {
            console.log('No matching documents found.');
            return;
        }

        const batch = db.batch();
        let count = 0;

        snapshot.forEach(doc => {
            console.log(`Deleting: ${doc.id} - ${doc.data().title}`);
            batch.delete(doc.ref);
            count++;
        });

        await batch.commit();
        console.log(`\nSuccessfully deleted ${count} listings with incorrect coordinates.`);

    } catch (error) {
        console.error("Error:", error);
    }
}

cleanupListings();
