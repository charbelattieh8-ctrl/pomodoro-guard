import { adminAuth } from "./firebase-admin.js";

export async function verifyUser(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const token = header.replace(/^Bearer\s+/i, "");
  if (!token) {
    throw new Error("Missing auth token");
  }
  const decoded = await adminAuth.verifyIdToken(token);
  if (decoded.firebase?.sign_in_provider === "anonymous") {
    throw new Error("Anonymous users cannot purchase CPoints");
  }
  return decoded;
}
