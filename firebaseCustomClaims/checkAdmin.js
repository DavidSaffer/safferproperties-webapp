const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');  // Replace with the path to your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const checkAdminClaim = async (uid) => {
    try {
      const user = await admin.auth().getUser(uid);
      const claims = user.customClaims;
      if (claims && claims.admin === true) {
        console.log(`User ${uid} is an admin.`);
      } else {
        console.log(`User ${uid} is not an admin.`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  // Example usage:
  checkAdminClaim('');  // Replace 'user-uid' with the actual UID of the user
  