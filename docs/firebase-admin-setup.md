# Firebase admin console

The console is at `/admin`. The public menu stays at `/` and subscribes to the published Firestore menu. The bundled menu is the fallback until the first publication or when the connection cannot load.

## Required one-time setup

1. In Firebase Authentication, enable **Email/Password** and create the first administrator account. Add the deployed domain to Authentication's authorized domains.
2. Give the Next.js server Firebase Admin credentials for `kitchini-cf37a`. Set `FIREBASE_SERVICE_ACCOUNT_JSON` using your hosting provider's secret manager, or use Application Default Credentials (`GOOGLE_APPLICATION_CREDENTIALS` locally). Never put a service-account private key in a client variable or Git.
3. With those same credentials available locally, run `node scripts/set-admin.mjs your-email@example.com`. This grants the existing account the admin role. Sign out and back in afterward.
4. Deploy the supplied rules: `firebase deploy --only firestore:rules --project kitchini-cf37a`. Review the rules first if this Firebase project serves other apps: this ruleset allows public reads of `menu/current` and denies all direct client writes and other reads. Admin API writes use server credentials.
5. Run the app on a Node.js Next.js host (not a static export). Open `/admin`, sign in, review the existing menu, then choose **Publish initial menu**.

## Included

- Menu item creation, editing, deletion, category assignment, prices, dietary labels, availability; category creation, editing, ordering, theme and subtitle; contact/social fields; JSON export.
- Changes stay in a draft until publication. A revision check prevents overwriting another session's publication. Publication and its activity record are written in one transaction.
- Administrators manage Firebase Authentication users, including creating, renaming, changing email/role, disabling and permanently deleting accounts. New accounts require a temporary password of at least 12 characters. Users can request a password reset from the sign-in page. No emails are sent automatically on account creation.
- Editors manage menus; viewers can read the menu dashboard. The server verifies tokens, revocation and the current account role for every request. Users cannot delete themselves or remove their own administrator access.
- Menu item count, available/unavailable counts, average price, category distribution, recent publishing activity. These are menu metrics, not sales figures. Sales, orders, average order value, and best sellers require a future ordering/POS integration.

## Notes

Firebase browser identifiers are public configuration. Server credentials remain private. Firebase Analytics is intentionally not initialized: the requested operational metrics are calculated from menu data and do not require visitor tracking.

User listing is paginated in groups of 100. User changes take effect immediately at API authorization, even before the browser updates its role display. Refresh/sign in again to update the visible navigation. Deletion removes the Authentication account; this version does not create separate user profile documents.

The service-account credentials, first admin identity, and permission to access this Firebase project were not available during implementation. Live sign-in, data writes and user lifecycle operations require the above setup and should be verified against a test Firebase project before production use.
