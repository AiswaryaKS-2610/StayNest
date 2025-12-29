const admin = require('firebase-admin');
const db = admin.firestore();


exports.submitVerification = async (req, res) => {
    try {
        const { idFront, idBack, proofOfAddress } = req.body;
        const userId = req.user.uid;

        
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();

        
        const existingVerification = await db.collection('verifications')
            .where('brokerId', '==', userId)
            .where('status', '==', 'pending')
            .get();

        if (!existingVerification.empty) {
            return res.status(400).json({ error: 'You already have a pending verification request' });
        }

        
        const verificationData = {
            brokerId: userId,
            brokerName: userData.name || userData.email,
            brokerEmail: userData.email,
            idFront,
            idBack,
            proofOfAddress,
            status: 'pending',
            submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            reviewedAt: null,
            reviewedBy: null,
            rejectionReason: null
        };

        const verificationRef = await db.collection('verifications').add(verificationData);

        res.status(201).json({
            message: 'Verification request submitted successfully',
            verificationId: verificationRef.id
        });
    } catch (error) {
        console.error('Error submitting verification:', error);
        res.status(500).json({ error: 'Failed to submit verification request' });
    }
};


exports.getAllVerifications = async (req, res) => {
    try {
        const { status } = req.query;

        let query = db.collection('verifications');

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.get();

        const verifications = [];
        snapshot.forEach(doc => {
            verifications.push({
                id: doc.id,
                ...doc.data()
            });
        });

        
        verifications.sort((a, b) => {
            const aTime = a.submittedAt?._seconds || 0;
            const bTime = b.submittedAt?._seconds || 0;
            return bTime - aTime; 
        });

        res.json(verifications);
    } catch (error) {
        console.error('Error fetching verifications:', error);
        res.status(500).json({ error: 'Failed to fetch verifications' });
    }
};


exports.approveVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.uid;

        const verificationRef = db.collection('verifications').doc(id);
        const verificationDoc = await verificationRef.get();

        if (!verificationDoc.exists) {
            return res.status(404).json({ error: 'Verification request not found' });
        }

        const verificationData = verificationDoc.data();

        
        await verificationRef.update({
            status: 'approved',
            reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
            reviewedBy: adminId
        });

        
        await db.collection('users').doc(verificationData.brokerId).update({
            isVerified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: 'Verification approved successfully' });
    } catch (error) {
        console.error('Error approving verification:', error);
        res.status(500).json({ error: 'Failed to approve verification' });
    }
};


exports.rejectVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const adminId = req.user.uid;

        const verificationRef = db.collection('verifications').doc(id);
        const verificationDoc = await verificationRef.get();

        if (!verificationDoc.exists) {
            return res.status(404).json({ error: 'Verification request not found' });
        }

        
        await verificationRef.update({
            status: 'rejected',
            reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
            reviewedBy: adminId,
            rejectionReason: reason || 'Documents did not meet verification requirements'
        });

        res.json({ message: 'Verification rejected successfully' });
    } catch (error) {
        console.error('Error rejecting verification:', error);
        res.status(500).json({ error: 'Failed to reject verification' });
    }
};


exports.getMyVerification = async (req, res) => {
    try {
        const userId = req.user.uid;
        console.log(`[DEBUG] getMyVerification called for user: ${userId}`);

        const snapshot = await db.collection('verifications')
            .where('brokerId', '==', userId)
            .get();

        if (snapshot.empty) {
            return res.json({ verification: null });
        }

        const verifications = [];
        snapshot.forEach(doc => {
            verifications.push({
                id: doc.id,
                ...doc.data()
            });
        });

        
        verifications.sort((a, b) => {
            const aTime = a.submittedAt?._seconds || 0;
            const bTime = b.submittedAt?._seconds || 0;
            return bTime - aTime;
        });

        res.json({
            verification: verifications[0]
        });
    } catch (error) {
        console.error('Error fetching verification:', error);
        res.status(500).json({ error: 'Failed to fetch verification status' });
    }
};
