const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function listAndSetAdmin() {
    try {
        console.log('Fetching all users...\n');

        const usersSnapshot = await db.collection('users').get();

        if (usersSnapshot.empty) {
            console.log('No users found in database.');
            return;
        }

        console.log('Available users:');
        const users = [];
        usersSnapshot.forEach(doc => {
            const data = doc.data();
            users.push({ id: doc.id, ...data });
            console.log(`  ${users.length}. ${data.email || 'No email'} - Role: ${data.role || 'none'}`);
        });

        
        if (users.length > 0) {
            const firstUser = users[0];
            console.log(`\n🔧 Setting ${firstUser.email} as admin...`);

            await db.collection('users').doc(firstUser.id).update({
                role: 'admin'
            });

            console.log(`✅ Successfully set ${firstUser.email} as admin!`);
            console.log('\n⚠️  IMPORTANT: Log out and log back in for changes to take effect.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

listAndSetAdmin();
