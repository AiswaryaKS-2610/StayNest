const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccountKeyPath = './serviceAccountKey.json';
let serviceAccount;

try {
    serviceAccount = require(serviceAccountKeyPath);
} catch (error) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        throw new Error('Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT env var or provide serviceAccountKey.json');
    }
}

require('dotenv').config();


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verifications', verificationRoutes);

app.get('/', (req, res) => {
    res.send('StayNest API is running 🚀');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
