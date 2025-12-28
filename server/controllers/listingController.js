const admin = require('firebase-admin');

const getListings = async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('listings')
            .where('status', '==', 'approved')
            .get();

        // Fetch all verified brokers to avoid multiple hits
        const verifiedUsersSnapshot = await db.collection('users')
            .where('isVerified', '==', true)
            .get();

        const verifiedUserIds = new Set();
        verifiedUsersSnapshot.forEach(doc => verifiedUserIds.add(doc.id));

        const listings = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                brokerVerified: verifiedUserIds.has(data.ownerUid)
            };
        });

        res.json(listings);
    } catch (error) {
        console.error("Firestore Get Error:", error);
        res.status(500).json({ message: "Server Error fetching listings" });
    }
};

const getBrokerListings = async (req, res) => {
    try {
        const uid = req.user.uid;
        const db = admin.firestore();

        // Check if broker is verified
        const userDoc = await db.collection('users').doc(uid).get();
        const isVerified = userDoc.exists && userDoc.data().isVerified === true;

        const snapshot = await db.collection('listings')
            .where('ownerUid', '==', uid)
            .get();

        const listings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            brokerVerified: isVerified
        }));

        res.json(listings);
    } catch (error) {
        console.error("Broker Listings Error:", error);
        res.status(500).json({ message: "Error fetching your listings" });
    }
};

const createListing = async (req, res) => {
    try {
        const db = admin.firestore();
        const newListing = req.body;

        // Add timestamp and initial status
        newListing.createdAt = admin.firestore.FieldValue.serverTimestamp();
        newListing.status = 'pending'; // All new broker listings start as pending

        const docRef = await db.collection('listings').add(newListing);
        res.status(201).json({ message: "Listing created", id: docRef.id });
    } catch (error) {
        console.error("Firestore Add Error:", error);
        res.status(500).json({ message: "Failed to create listing" });
    }
};

const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const db = admin.firestore();
        const updatedData = req.body;

        // Don't allow updating createdAt or ownerUid
        delete updatedData.createdAt;
        delete updatedData.ownerUid;

        await db.collection('listings').doc(id).update(updatedData);
        res.json({ message: "Listing updated successfully" });
    } catch (error) {
        console.error("Firestore Update Error:", error);
        res.status(500).json({ message: "Failed to update listing" });
    }
};

const incrementViewCount = async (req, res) => {
    try {
        const { id } = req.params;
        const db = admin.firestore();

        await db.collection('listings').doc(id).update({
            views: admin.firestore.FieldValue.increment(1)
        });
        res.json({ message: "View count incremented" });
    } catch (error) {
        console.error("Firestore Increment Error:", error);
        res.status(500).json({ message: "Failed to increment view count" });
    }
};

module.exports = { getListings, getBrokerListings, createListing, updateListing, incrementViewCount };
