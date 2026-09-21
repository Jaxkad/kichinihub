# Published menu loading and caching

The landing page and category pages read `menu/current` on the server, validate it with the same schema as publishing, and pass it into the interactive menu. They never initialize public content from the bundled sample menu. Categories without artwork still use their normal text cards.

## Cache lifecycle

- `getPublishedMenu` uses Next.js's persistent `fetch` Data Cache with the `published-menu` tag and a 300-second revalidation interval. Firebase's public REST endpoint respects the existing read-only rule; this does not expose any new documents or require administrator credentials for rendering.
- The landing page is prerendered with the published data and can be served from Next.js's full-route/CDN cache. Category pages share the same data cache.
- A successful admin menu PUT commits the menu and activity entry first, then calls `revalidateTag(tag, { expire: 0 })` and invalidates the landing/category paths. The next server request regenerates from published data rather than receiving an intentionally stale version. A failed or conflicting transaction does not invalidate caches.
- The five-minute interval is a backup for changes outside the editor. This is stale-while-revalidate, not a promise that every tab updates within exactly five minutes. Already-open hydrated pages retain the Firestore listener, which accepts only newer revisions. An older browser snapshot cannot roll back server-rendered data.
- The existing one-year image cache remains separate. Each upload uses a unique URL, so changing artwork bypasses the old image cache naturally.

## Loading and failures

`loading.tsx` provides neutral, static 2:1 placeholders and an accessible status message when navigation needs to wait. Images also reserve their final proportions. No minimum loading delay or animation is imposed.

Cold data reads have an eight-second timeout. Missing/invalid published data and network errors propagate to a retry boundary; they are never replaced by sample prices or saved as successful fallback HTML. Next.js can continue serving an existing successful page during failed background regeneration. Browser subscription failures keep the last loaded published menu.

A first deployment/build requires the published document to be readable. A failed build leaves the previous deployment intact rather than shipping the sample menu. `FIRESTORE_EMULATOR_HOST` is supported for isolated local testing; do not configure it on the live deployment.

## Implementation choice and official references

This application does not enable Cache Components. It uses the documented `fetch` cache API directly, avoiding the superseded `unstable_cache` API and an unrelated application-wide Cache Components migration.

- [Next.js fetch caching, tags and revalidation](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [Next.js revalidateTag, including expire: 0 for Route Handlers](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Next.js loading UI and streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [Next.js error boundaries and retry](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Firebase REST API](https://firebase.google.com/docs/firestore/use-rest-api)

The installed Next.js 16.3.4 documentation was checked before implementation; notably this version uses the `retry` error-boundary prop.

## Verification

Run `node --experimental-strip-types --test tests/*.test.mjs`, `npx tsc --noEmit`, targeted ESLint, and `npm run build`.

`published-menu.test.mjs` covers REST decoding, artwork preservation, content validation, fetch caching options, upstream failure, and the actual publish handler with mocked authentication/database/cache services. It checks successful, rejected, conflicting and failed publications without writing to the live menu.

A local production run was checked against the read-only published document: all 12 category links and all 12 images appeared in the server HTML, the landing page reported a cache HIT, and the category response included artwork and dishes. Browser navigation from the landing page to the category also passed. A second local production process with an unavailable test data source showed the expected retry screen, without sample menu content. Local response timing is not a mobile-network benchmark.
