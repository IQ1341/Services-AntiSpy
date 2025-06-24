const admin = require("firebase-admin");

if (!admin.apps.length) {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!base64) {
    throw new Error("Environment variable FIREBASE_SERVICE_ACCOUNT tidak ditemukan.");
  }

  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const serviceAccount = JSON.parse(decoded);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = { admin, db };
