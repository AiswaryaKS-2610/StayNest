const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function cleanupAllBadListings() {
    try {
        console.log("Fetching all listings...");
        const snapshot = await db.collection('listings').get();

        const toDelete = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            const lat = data.lat;
            const lng = data.lng;

            
            if (lat === 52.0600343 && lng === -0.347478) {
                console.log(`❌ Bad UK coords: ${doc.id} - ${data.title}`);
                toDelete.push(doc.id);
            }
            
            else if (lat === undefined || lat === null || lng === undefined || lng === null) {
                console.log(`❌ Missing coords: ${doc.id} - ${data.title}`);
                toDelete.push(doc.id);
            }
            
            else if (lat < 51.4 || lat > 55.4 || lng < -10.5 || lng > -5.5) {
                console.log(`❌ Non-Ireland coords: ${doc.id} - ${data.title} (${lat}, ${lng})`);
                toDelete.push(doc.id);
            }
            else {
                console.log(`✅ Valid: ${doc.id} - ${data.title} (${lat}, ${lng})`);
            }
        });

        if (toDelete.length === 0) {
            console.log('\n✅ No bad listings found!');
            return;
        }

        console.log(`\n🗑️  Deleting ${toDelete.length} bad listings...`);
        const batch = db.batch();
        toDelete.forEach(id => {
            batch.delete(db.collection('listings').doc(id));
        });

        await batch.commit();
        console.log(`\n✅ Successfully deleted ${toDelete.length} listings!`);

    } catch (error) {
        console.error("Error:", error);
    }
}

cleanupAllBadListings();
