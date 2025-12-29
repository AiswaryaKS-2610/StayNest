const admin = require('firebase-admin');

const registerUser = async (req, res) => {
    const { uid, email, role, fullName } = req.body;

    if (!uid || !email || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const db = admin.firestore();

        
        await db.collection('users').doc(uid).set({
            email,
            role,
            fullName,
            verified: role === 'broker' ? false : true, 
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ message: 'User profile created successfully' });
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserProfile = async (req, res) => {
    const uid = req.user.uid; 

    try {
        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userDoc.data());
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { registerUser, getUserProfile };
