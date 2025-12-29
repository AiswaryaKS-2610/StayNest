const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function fixUserAndVerify(email) {
    try {
        console.log(`Fixing user: ${email}...`);

        const userSnapshot = await db.collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            console.log(`❌ No user found with email: ${email}`);
            return;
        }

        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        
        await db.collection('users').doc(userId).update({
            role: 'broker',
            isVerified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ User ${email} (UID: ${userId}) updated to 'broker' and set to verified: true.`);

        
        const verifSnapshot = await db.collection('verifications').where('brokerId', '==', userId).get();

        const verifData = {
            brokerId: userId,
            brokerName: email.split('@')[0],
            brokerEmail: email,
            idFront: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            idBack: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            proofOfAddress: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            status: 'approved',
            submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
            reviewedBy: 'system-fix'
        };

        if (verifSnapshot.empty) {
            await db.collection('verifications').add(verifData);
            console.log(`✅ Created approved verification record for ${email}.`);
        } else {
            const verifDocId = verifSnapshot.docs[0].id;
            await db.collection('verifications').doc(verifDocId).update({
                status: 'approved',
                reviewedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Updated existing verification record to 'approved' for ${email}.`);
        }

        console.log('\n🚀 DONE! Please log out and log back in (or refresh) with ' + email);

    } catch (error) {
        console.error('Error:', error);
    }
}


fixUserAndVerify('aiswaryakswork@gmail.com');
fixUserAndVerify('aiswaryaks2610@gmail.com');
