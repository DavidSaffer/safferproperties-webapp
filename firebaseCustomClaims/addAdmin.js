const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  databaseURL: 'https://safferproperties-6bead-default-rtdb.firebaseio.com',
});

const uid = '';

return admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
    console.log(`Admin claim added to ${uid}`);
  });
