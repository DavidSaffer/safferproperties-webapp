Make sure you set your .env.local file in the same directory as package.json

should be like this

```bash
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebasedatabase.app
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEFGH
```

Go to
src/Pages/HomePage.js

to modify featured properties
