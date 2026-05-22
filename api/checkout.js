import { stripe } from "./_lib/stripe.js";
import { adminDb } from "./_lib/firebase-admin.js";
import { verifyUser } from "./_lib/auth.js";
import { COIN_PACKAGES } from "./_lib/packages.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decoded = await verifyUser(req);
    const { packageId } = req.body || {};

    const pkg = COIN_PACKAGES[packageId];
    if (!pkg) {
      return res.status(400).json({ error: "Invalid package" });
    }

    // Rate limit: max 5 purchases per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSnap = await adminDb
      .collection("transactions")
      .where("uid", "==", decoded.uid)
      .where("createdAt", ">=", oneHourAgo)
      .limit(6)
      .get();

    if (recentSnap.size >= 5) {
      return res.status(429).json({ error: "Too many purchases. Try again later." });
    }

    const origin = req.headers.origin || req.headers.referer?.replace(/\/+$/, "") || "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: pkg.priceUsdCents,
            product_data: { name: pkg.label },
          },
          quantity: 1,
        },
      ],
      metadata: {
        uid: decoded.uid,
        packageId,
        coinsToGrant: String(pkg.coins),
      },
      success_url: `${origin}/shop?purchase=success`,
      cancel_url: `${origin}/shop?purchase=cancelled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    const message = err.message || "Checkout failed";
    const status = message.includes("auth") || message.includes("Anonymous") ? 401 : 500;
    return res.status(status).json({ error: message });
  }
}
