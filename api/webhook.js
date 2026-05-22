import { stripe } from "./_lib/stripe.js";
import { adminDb } from "./_lib/firebase-admin.js";
import admin from "firebase-admin";

// Disable Vercel's default body parsing — we need the raw body for signature verification
export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object);
    } else if (event.type === "charge.refunded") {
      await handleRefund(event.data.object);
    }
    // Acknowledge all event types with 200
    return res.status(200).json({ received: true });
  } catch (err) {
    // Return 500 so Stripe retries
    return res.status(500).json({ error: err.message });
  }
}

async function handleCheckoutCompleted(session) {
  const { uid, packageId, coinsToGrant } = session.metadata || {};
  const paymentIntentId = session.payment_intent;

  if (!uid || !packageId || !coinsToGrant || !paymentIntentId) {
    throw new Error("Missing metadata on checkout session");
  }

  const coins = Number(coinsToGrant);
  if (!Number.isFinite(coins) || coins <= 0) {
    throw new Error("Invalid coinsToGrant value");
  }

  const txRef = adminDb.collection("transactions").doc(paymentIntentId);
  const userRef = adminDb.collection("users").doc(uid);
  const historyRef = userRef.collection("purchaseHistory").doc(paymentIntentId);

  await adminDb.runTransaction(async (tx) => {
    const txSnap = await tx.get(txRef);

    // Idempotency: skip if already processed
    if (txSnap.exists) return;

    const now = admin.firestore.FieldValue.serverTimestamp();
    const inc = admin.firestore.FieldValue.increment;

    // Record the transaction
    tx.set(txRef, {
      uid,
      packageId,
      coinsGranted: coins,
      amountUsdCents: session.amount_total || 0,
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      status: "completed",
      createdAt: now,
      refundedAt: null,
    });

    // Grant coins to user
    tx.set(
      userRef,
      {
        coins: inc(coins),
        purchasedTotal: inc(coins),
        updatedAt: now,
      },
      { merge: true }
    );

    // Record in user's purchase history
    tx.set(historyRef, {
      packageId,
      coinsGranted: coins,
      amountUsdCents: session.amount_total || 0,
      status: "completed",
      createdAt: now,
    });
  });
}

async function handleRefund(charge) {
  const paymentIntentId = charge.payment_intent;
  if (!paymentIntentId) return;

  const txRef = adminDb.collection("transactions").doc(paymentIntentId);
  const txSnap = await txRef.get();
  if (!txSnap.exists) return;

  const txData = txSnap.data();
  if (txData.status === "refunded") return; // Already refunded

  const userRef = adminDb.collection("users").doc(txData.uid);
  const historyRef = userRef.collection("purchaseHistory").doc(paymentIntentId);
  const now = admin.firestore.FieldValue.serverTimestamp();
  const inc = admin.firestore.FieldValue.increment;

  await adminDb.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    const currentCoins = Number(userSnap.data()?.coins || 0);
    const deduction = Math.min(txData.coinsGranted, currentCoins); // Don't go negative

    tx.update(txRef, { status: "refunded", refundedAt: now });
    tx.set(
      userRef,
      {
        coins: inc(-deduction),
        purchasedTotal: inc(-deduction),
        updatedAt: now,
      },
      { merge: true }
    );
    tx.set(historyRef, { status: "refunded" }, { merge: true });
  });
}
