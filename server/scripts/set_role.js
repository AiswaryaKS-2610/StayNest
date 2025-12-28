const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function setUserRole() {
    try {
        const email = process.argv[2];
        const newRole = process.argv[3];

        if (!email || !newRole) {
            console.log('Usage: node set_role.js <email> <role>');
            return;
        }

        console.log(`Searching for user: ${email}`);
        const usersSnapshot = await db.collection('users').where('email', '==', email).get();

        if (usersSnapshot.empty) {
            console.log(`❌ No user found with email: ${email}`);
            return;
        }

        const userDoc = usersSnapshot.docs[0];
        console.log(`Found user ${email}. Current role: ${userDoc.data().role}`);

        await db.collection('users').doc(userDoc.id).update({
            role: newRole
        });

        console.log(`✅ Successfully updated ${email} to role: ${newRole}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

setUserRole();
