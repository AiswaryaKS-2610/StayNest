const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkListing() {
    try {
        console.log("Fetching listings...");
        const snapshot = await db.collection('listings').get();

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`\nID: ${doc.id}`);
            console.log(`Title: ${data.title}`);
            console.log(`Location: ${data.location}`);
            console.log(`Lat: ${data.lat}, Lng: ${data.lng}`);
            console.log(`Type of Lat: ${typeof data.lat}`);

            
            const tuLat = 53.3547;
            const tuLng = -6.2795;

            if (data.lat && data.lng) {
                const dist = getDistance(tuLat, tuLng, parseFloat(data.lat), parseFloat(data.lng));
                console.log(`Calculated Distance to TU Dublin: ${dist.toFixed(2)} km`);
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

checkListing();
