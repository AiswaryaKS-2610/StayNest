const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function createTestVerification() {
    try {
        
        const usersSnapshot = await db.collection('users')
            .where('role', '==', 'broker')
            .get();

        if (usersSnapshot.empty) {
            console.log('❌ No broker users found.');
            return;
        }

        console.log('Found broker users:\n');
        const brokers = [];
        usersSnapshot.forEach(doc => {
            const data = doc.data();
            brokers.push({ id: doc.id, ...data });
            console.log(`${brokers.length}. ${data.email || 'No email'} (${data.name || 'No name'})`);
        });

        
        const broker = brokers[0];
        console.log(`\n📝 Creating approved verification for: ${broker.email}`);

        
        const existingVerification = await db.collection('verifications')
            .where('brokerId', '==', broker.id)
            .get();

        if (!existingVerification.empty) {
            console.log('⚠️  Verification already exists for this broker. Updating status to approved...');
            const verificationDoc = existingVerification.docs[0];
            await db.collection('verifications').doc(verificationDoc.id).update({
                status: 'approved',
                reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
                reviewedBy: 'auto-script'
            });
        } else {
            
            await db.collection('verifications').add({
                brokerId: broker.id,
                brokerName: broker.name || broker.email,
                brokerEmail: broker.email,
                idFront: 'https://via.placeholder.com/400x300?text=ID+Front',
                idBack: 'https://via.placeholder.com/400x300?text=ID+Back',
                proofOfAddress: 'https://via.placeholder.com/400x300?text=Proof+of+Address',
                status: 'approved',
                submittedAt: admin.firestore.FieldValue.serverTimestamp(),
                reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
                reviewedBy: 'auto-script'
            });
        }

        
        await db.collection('users').doc(broker.id).update({
            isVerified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('\n✅ SUCCESS! Verification created and approved!');
        console.log(`\n📋 Next steps:`);
        console.log(`1. Log in as: ${broker.email}`);
        console.log(`2. Navigate to: /broker/verification`);
        console.log(`3. You should see: "Verification Approved!" ✅`);
        console.log(`\nIf you're already logged in as this user, just refresh the page!`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

createTestVerification();
