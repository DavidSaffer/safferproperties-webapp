const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK as previously done
admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
  databaseURL: "https://safferproperties-6bead-default-rtdb.firebaseio.com"
});

const uid = "";

// Remove the 'admin' custom claim from the specified user
admin
  .auth()
  .setCustomUserClaims(uid, { admin: null })
  .then(() => {
    console.log(`Admin claim removed from ${uid}`);
  })
  .catch((error) => {
    console.error("Error removing admin claim:", error);
  });
