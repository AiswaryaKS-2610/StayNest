const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function setAdminRole() {
    try {
        
        const email = process.argv[2];

        if (!email) {
            console.log('Usage: node set_admin.js <email>');
            console.log('Example: node set_admin.js admin@example.com');
            return;
        }

        console.log(`Searching for user with email: ${email}`);

        
        const usersSnapshot = await db.collection('users')
            .where('email', '==', email)
            .get();

        if (usersSnapshot.empty) {
            console.log(`❌ No user found with email: ${email}`);
            console.log('\nAvailable users:');
            const allUsers = await db.collection('users').get();
            allUsers.forEach(doc => {
                const data = doc.data();
                console.log(`  - ${data.email} (${data.role || 'no role'})`);
            });
            return;
        }

        const userDoc = usersSnapshot.docs[0];
        const userId = userDoc.id;
        const userData = userDoc.data();

        console.log(`Found user: ${userData.email}`);
        console.log(`Current role: ${userData.role || 'none'}`);

        
        await db.collection('users').doc(userId).update({
            role: 'admin'
        });

        console.log(`\n✅ Successfully set ${email} as admin!`);
        console.log('Please log out and log back in for changes to take effect.');

    } catch (error) {
        console.error('Error:', error);
    }
}

setAdminRole();
