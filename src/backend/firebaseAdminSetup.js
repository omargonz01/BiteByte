import admin from 'firebase-admin';

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Decode the base64 environment variable to an object
  const serviceAccountDecoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii');
  serviceAccount = JSON.parse(serviceAccountDecoded);
} else {
  // Fallback to JSON file for local development or if not using an environment variable
  // Make sure the path is correct for your local development environment
  serviceAccount = require('./path/to/local/serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bitebyte-app-default-rtdb.firebaseio.com"
});

export { admin };
