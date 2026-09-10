import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const email = process.argv[2];
if (!email)
  throw new Error("Usage: node scripts/set-admin.mjs your-email@example.com");
initializeApp({
  projectId: "kitchini-cf37a",
  credential: process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
    : applicationDefault(),
});
const auth = getAuth();
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, {
  ...user.customClaims,
  role: "admin",
});
console.log("Administrator access granted. Sign out and sign in again.");
