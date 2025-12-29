const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        
        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();

        if (userDoc.exists && userDoc.data().isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked by an administrator.' });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(req.user.uid).get();

        if (userDoc.exists && userDoc.data().role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Admin access required" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error checking admin status" });
    }
};

module.exports = { verifyToken, verifyAdmin };
