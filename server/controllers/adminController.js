const admin = require('firebase-admin');

// LISTING ACTIONS
const getPendingListings = async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('listings')
            .where('status', '==', 'pending')
            .get();
        const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending listings" });
    }
};

const approveListing = async (req, res) => {
    const { id } = req.params;
    try {
        const db = admin.firestore();
        await db.collection('listings').doc(id).update({ status: 'approved' });
        res.json({ message: "Listing approved!" });
    } catch (error) {
        res.status(500).json({ message: "Approval failed" });
    }
};

const rejectListing = async (req, res) => {
    const { id } = req.params;
    try {
        const db = admin.firestore();
        await db.collection('listings').doc(id).update({ status: 'rejected' });
        res.json({ message: "Listing rejected" });
    } catch (error) {
        res.status(500).json({ message: "Rejection failed" });
    }
};

const adminDeleteListing = async (req, res) => {
    const { id } = req.params;
    try {
        const db = admin.firestore();
        await db.collection('listings').doc(id).delete();
        res.json({ message: "Listing deleted by admin" });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed" });
    }
};

// BROKER ACTIONS
const getBrokers = async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('users')
            .where('role', '==', 'broker')
            .get();
        const brokers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(brokers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brokers" });
    }
};

const verifyBroker = async (req, res) => {
    const { id } = req.params;
    try {
        const db = admin.firestore();
        await db.collection('users').doc(id).update({ verified: true });
        res.json({ message: "Broker verified!" });
    } catch (error) {
        res.status(500).json({ message: "Verification failed" });
    }
};

const blockUser = async (req, res) => {
    const { id } = req.params;
    const { block } = req.body; // boolean
    try {
        const db = admin.firestore();
        await db.collection('users').doc(id).update({ isBlocked: block });
        res.json({ message: block ? "User blocked" : "User unblocked" });
    } catch (error) {
        res.status(500).json({ message: "Action failed" });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const db = admin.firestore();

        // Parallel fetch for counts
        const [listingsSnap, usersSnap] = await Promise.all([
            db.collection('listings').count().get(),
            db.collection('users').count().get()
        ]);

        // Note: count() aggregation requires newer Firebase Admin SDK. 
        // If that fails, we might fall back to Snapshot.size

        const pendingSnap = await db.collection('listings').where('status', '==', 'pending').get();
        const brokersSnap = await db.collection('users').where('role', '==', 'broker').get();
        const unverifiedBrokers = brokersSnap.docs.filter(doc => !doc.data().verified).length;

        res.json({
            totalListings: listingsSnap.data().count,
            totalUsers: usersSnap.data().count,
            pendingListings: pendingSnap.size,
            totalBrokers: brokersSnap.size,
            unverifiedBrokers
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Stats fetch failed" });
    }
};

module.exports = {
    getPendingListings,
    approveListing,
    rejectListing,
    adminDeleteListing,
    getBrokers,
    verifyBroker,
    blockUser,
    getAdminStats
};
