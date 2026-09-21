# Khichini Hub

Public restaurant menu and events site, with a staff workspace at `/admin` for menu editing, category artwork, events and team access.

## Local development

Use a Node.js version supported by the installed Next.js release. Run `npm ci`, copy `.env.example` to `.env.local`, and configure the server's Firebase service account for staff features. Keep that private credential out of source control and never prefix it with `NEXT_PUBLIC_`.

Run `npm run dev` and open http://localhost:3000. The published menu is publicly readable under the existing Firestore rules; admin operations require an authenticated account with the appropriate role. `scripts/set-admin.mjs` is a maintainer utility for initial account setup; review it before use.

## Checks

- `node --experimental-strip-types --test tests/*.test.mjs`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run start` to inspect the production build locally.

A production build reads the published menu. It must be available and valid; the build does not silently substitute sample content.

## Documentation

- [Published-menu caching, loading and verification](docs/menu-loading.md)
- [Launch checks and client handoff](docs/client-handoff.md)

The final domain must be allowed by the upload endpoint, Storage CORS configuration and Firebase sign-in settings. Configure the hosting environment separately; do not deploy `.env` files or local emulator logs.
