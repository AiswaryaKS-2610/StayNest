const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
require('dotenv').config({ path: '../.env' }); 

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const dummyListings = [
    {
        title: "Cozy Cottage in Galway",
        price: 1200,
        location: "Salthill, Galway",
        image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
        tags: ["ocean view", "parking"],
        rtb: true,
        lat: 53.2600,
        lng: -9.0600,
        description: "A charming cottage by the sea. Perfect for a quiet getaway or a peaceful study environment.",
        status: "approved",
        views: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Modern Apartment in Limerick City",
        price: 950,
        location: "City Centre, Limerick",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        tags: ["wifi", "central"],
        rtb: true,
        lat: 52.6680,
        lng: -8.6300,
        description: "Stylish apartment in the heart of Limerick. Walking distance to all amenities and transport links.",
        status: "approved",
        views: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
];

const seedListings = async () => {
    try {
        const batch = db.batch();

        dummyListings.forEach(listing => {
            const docRef = db.collection('listings').doc();
            batch.set(docRef, listing);
        });

        await batch.commit();
        console.log('Successfully added dummy listings!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding listings:', error);
        process.exit(1);
    }
};

seedListings();
