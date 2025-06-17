const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Firebase Admin SDK hanya jika belum ada instance
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON belum diset di environment variable');
}

const serviceAccount = JSON.parse(serviceAccountJson);

// Inisialisasi Firebase Admin SDK jika belum ada
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Endpoint untuk menerima data history dari ESP32
app.post('/api/history', async (req, res) => {
  const { motion, timestamp } = req.body;

  if (!['Terdeteksi', 'Tidak terdeteksi'].includes(motion)) {
    return res.status(400).json({ error: 'Nilai motion tidak valid' });
  }

  try {
    const docRef = await db.collection('History').add({
      motion,
      timestamp,
      createdAt: new Date(),
    });
    res.status(200).json({ message: 'Data tersimpan', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export sebagai handler serverless
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
