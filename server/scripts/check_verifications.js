const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkVerifications() {
    try {
        console.log('Fetching all verifications...\n');

        const snapshot = await db.collection('verifications').get();

        if (snapshot.empty) {
            console.log('❌ No verifications found in database.');
            return;
        }

        console.log(`Found ${snapshot.size} verification(s):\n`);

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log('─'.repeat(60));
            console.log(`ID: ${doc.id}`);
            console.log(`Broker: ${data.brokerName} (${data.brokerEmail})`);
            console.log(`Broker ID: ${data.brokerId}`);
            console.log(`Status: ${data.status}`);
            console.log(`Submitted: ${data.submittedAt ? new Date(data.submittedAt._seconds * 1000).toLocaleString() : 'N/A'}`);
            if (data.rejectionReason) {
                console.log(`Rejection Reason: ${data.rejectionReason}`);
            }
            console.log('');
        });
        console.log('─'.repeat(60));

    } catch (error) {
        console.error('Error:', error);
    }
}

checkVerifications();
