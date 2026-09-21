# Launch and client handoff

Review date: 21 September 2026. This is a repository review, not confirmation that hosting accounts or the final domain are configured. The latest changes have not been deployed by this review.

## Confirmed work

- Published menu content is rendered on the server and cached. Publishing expires the shared menu cache.
- Category artwork has previews, dimensions, upload feedback, removal and text fallbacks.
- Public navigation includes matching loading layouts, restrained motion and retry screens.
- Admin pages request no search indexing. Server routes check roles before allowing changes.
- Feedback now avoids raw browser errors, validation-schema language and storage setup terminology.
- The staff workspace requires internet access. Menu drafts are held in the current page, not saved permanently to an account; publish before refreshing or closing if the changes should go live. Event drafts, by contrast, have a server save flow.

## Before deployment

| Priority | Action | Evidence / acceptance check |
| --- | --- | --- |
| Required | Confirm the final domain and connect uploads/sign-in to it. | The upload route and scripts/storage-cors.json currently list localhost and two Vercel domains only. If the final address differs, add its exact origin in both places, apply the bucket CORS configuration, and verify Firebase authorized domains and password-reset links. |
| Required | Review dependency advisories. | `npm audit --omit=dev` reports 9 moderate affected-package entries, 0 high, 0 critical. These include dependency chains, not necessarily nine distinct issues. Some proposed fixes move Firebase Admin to major version 14; assess applicability, upgrade/test or explicitly record the accepted risk. Do not run a forced upgrade blindly. |
| Required | Test the staff workflow using the final hosting configuration. | Sign in as administrator, editor and viewer; check denied actions. Add/change/remove JPG, PNG and iPhone photos; verify upload failure/retry. Publish a menu change and confirm it on another device. Test event drafts/publishing, password reset and sign-out. Existing automated publish tests mock database/authentication services; they do not replace this check. |
| Required | Confirm published content and branding with the client. | Prices, category names/artwork, availability, dietary labels, contact links, event times and social profiles. Site metadata currently says “Kichinihub” while public branding says “Khichini Hub”; approve a consistent spelling and final social-sharing image. |
| Required | Confirm ownership and recovery. | Client or agreed maintainer must control hosting, domain/DNS, Firebase/Google Cloud billing and repository access. Verify a working administrator account, a recovery contact and server credentials in hosting secrets. Never put private credentials in handoff documents. |
| Required | Check backups and rollback. | Save a recoverable copy of menu/events and verify how to restore it. Record the last working deployment. Reverting a deployment does not undo menu edits in Firestore. Agree who handles an incident. |
| Required | Run a release check on real devices. | Safari/iPhone and Chrome/Android; slower mobile connection; keyboard navigation, focus, zoom and reduced motion. Check direct category URLs, browser Back, empty states, failed images, offline behavior and staff workspace installation. Run Lighthouse/accessibility checks on the deployed preview and record results. No mobile performance score is claimed here. |
| Required | Set operational ownership. | Confirm error monitoring, uptime checks, budget alerts, support contact and maintenance responsibilities in hosting/Firebase. These external settings have not been verified. |
| Before release commit | Keep generated files out of the release. | `.firebase/logs/vsce-debug.log` is tracked and changes locally. Remove it from tracking in a deliberate cleanup and ignore future logs; preserve any logs needed for troubleshooting. |
| Recommended | Finish search and sharing setup. | Add final-domain canonical metadata, sitemap, robots policy and social-sharing preview. Keep admin pages excluded. Final-domain values are not yet established in this review. |

The root menu-specific loading/error screens currently also sit above admin routes. Scope them to public routes (or provide admin-specific boundaries) before calling the entire staff experience finished.

## Client walkthrough

1. Open `/admin` and sign in with your own account.
2. Edit a category or dish. For category artwork, use 1200 × 600 pixels and check the preview. Removing an image brings back the text card.
3. Save changes to the current menu draft, then choose Publish when ready for customers to see them. Do not close the page expecting an unpublished menu draft to be saved permanently.
4. Open the public menu on a second device and check the result.
5. Create an event, choose dates/times, add photos, save a draft and publish when ready. Uploaded files can be viewed by anyone with their direct link, even before an event is published.
6. Practise changing availability, replacing artwork and recovering from an interrupted upload.
7. Confirm who to contact for account access, content help or website problems. The current Help screen contains existing developer contact details; confirm they remain the agreed support details.

Deliver the site and staff links, account/access inventory (without passwords), this guide, image dimensions, backup/restore steps, support agreement, release reference and the client's content sign-off.

## Release gate

Run the tests, TypeScript, lint and production build on the exact release commit. Deploy a preview; complete the domain-dependent checks above. After the approved release, verify the public menu, category navigation, login, upload and publish again. Record the deployment URL and rollback reference.

## Official references

- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Firebase launch checklist](https://firebase.google.com/support/guides/launch-checklist)
- [Menu caching and testing details](menu-loading.md)
