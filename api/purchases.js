import { adminDb } from "./_lib/firebase-admin.js";
import { verifyUser } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decoded = await verifyUser(req);

    const snap = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .collection("purchaseHistory")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const purchases = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return res.status(200).json({ purchases });
  } catch (err) {
    const message = err.message || "Failed to fetch purchases";
    const status = message.includes("auth") || message.includes("Anonymous") ? 401 : 500;
    return res.status(status).json({ error: message });
  }
}
