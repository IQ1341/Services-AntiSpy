const { db, admin } = require("../firebase");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { motion, timestamp } = req.body;

  if (!motion || !timestamp) {
    return res.status(400).json({
      error: "Field 'motion' dan 'timestamp' wajib diisi",
    });
  }

  try {
    let dateObj;
    try {
      dateObj = new Date(timestamp.replace(" ", "T"));
    } catch (e) {
      console.warn("Gagal parse waktu, gunakan serverTimestamp");
    }

    const waktu = dateObj instanceof Date && !isNaN(dateObj)
      ? admin.firestore.Timestamp.fromDate(dateObj)
      : admin.firestore.FieldValue.serverTimestamp();

    await db.collection("History").add({
      motion,
      timestamp,
      waktu,
    });

    return res.status(200).json({
      success: true,
      message: "Data gerakan berhasil disimpan",
    });
  } catch (err) {
    console.error("Gagal menyimpan data:", err);
    return res.status(500).json({
      error: "Gagal menyimpan data gerakan",
      detail: err.message,
    });
  }
}
