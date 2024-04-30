import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Initialize the serviceAccount variable
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    // Decode the base64 environment variable to a string
    const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii');
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (error) {
    console.error("Failed to parse Firebase service account JSON from environment variable:", error);
    process.exit(1); // Exit the process with an error code
  }
} else {
  // Local development, use the require function to import the service account JSON
  serviceAccount = require('../../serviceAccountKey.json');
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bitebyte-app-default-rtdb.firebaseio.com",
    storageBucket: 'gs://bitebyte-app.appspot.com'
  });
  console.log('Firebase admin initialized successfully.');
} catch (error) {
  console.error('Failed to initialize Firebase admin:', error);
}

export { admin };
