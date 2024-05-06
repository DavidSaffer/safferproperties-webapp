const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  databaseURL: 'https://safferproperties-6bead-default-rtdb.firebaseio.com',
});

async function listAllAdmins() {
  let allUsers = [];
  let nextPageToken;

  // Loop through all users in the Firebase project. This might not be efficient for projects with a large number of users.
  do {
    await admin
      .auth()
      .listUsers(1000, nextPageToken) // Adjust maxResults as needed, max is 1000.
      .then(listUsersResult => {
        listUsersResult.users.forEach(userRecord => {
          const customClaims = userRecord.customClaims;
          if (customClaims && customClaims.admin === true) {
            allUsers.push(userRecord.toJSON()); // Collect admin user details
          }
        });
        nextPageToken = listUsersResult.pageToken;
      })
      .catch(error => {
        console.log('Error listing users:', error);
      });
  } while (nextPageToken);

  return allUsers; // Contains the details of all users with the admin claim
}

// Call the function and log results
listAllAdmins().then(admins => {
  console.log('Admin Users:', admins);
});
