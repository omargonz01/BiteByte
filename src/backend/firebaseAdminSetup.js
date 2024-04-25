import admin from 'firebase-admin';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Decode the base64 environment variable to an object
  const serviceAccountDecoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii');
  serviceAccount = JSON.parse(serviceAccountDecoded);
} else {
  // Dynamically import the JSON file for local development
  const serviceAccountModule = await import('../../serviceAccountKey.json', {
    assert: { type: 'json' }
  });
  serviceAccount = serviceAccountModule.default;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bitebyte-app-default-rtdb.firebaseio.com"
});

export { admin };
