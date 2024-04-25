import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Check if the environment variable is set for the Firebase service account
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Decode the base64 environment variable to a string
  const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii');
  serviceAccount = JSON.parse(serviceAccountString);
} else {
  // Local development, use the require function to import the service account JSON
  serviceAccount = require('../../serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bitebyte-app-default-rtdb.firebaseio.com"
});

export { admin };
