const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function listAllUsers() {
    try {
        console.log('Fetching all users...\n');

        const usersSnapshot = await db.collection('users').get();

        if (usersSnapshot.empty) {
            console.log('No users found in database.');
            return;
        }

        console.log(`Found ${usersSnapshot.size} user(s):\n`);
        console.log('─'.repeat(80));

        usersSnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`Email: ${data.email || 'N/A'}`);
            console.log(`Name: ${data.name || 'N/A'}`);
            console.log(`Role: ${data.role || 'NONE'}`);
            console.log(`UID: ${doc.id}`);
            console.log(`Verified: ${data.isVerified || false}`);
            console.log('─'.repeat(80));
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

listAllUsers();
