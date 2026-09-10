# Audience insights and event media

Implemented locally; no deployment or live test data was created.

## Audience reports

The admin console's Audience insights tab reads daily aggregates from Firestore for the last 7 or 30 Malawi calendar days. It reports public homepage loads, category selections and impressions, dish impressions, section impressions, event impressions and detail opens, gallery navigation, dietary filter selections, menu search usage, contact actions and social clicks. Search text is never sent. The public site is one page; section impressions distinguish its menu, events, welcome and contact areas. Admin activity is not instrumented.

Visitors opt in via the analytics preference banner. No analytics requests are made before opt-in; Do Not Track is respected. The preference is stored in localStorage. Changing preferences stops collection. Events contain only action kind, content ID and display label, with no stored visitor IDs, IP addresses, email addresses, or raw search queries. Vercel's own infrastructure logs are separate from this application-level collection.

Views are once-per-page-lifetime observations when an element intersects the middle 60% of the screen. A page reload is another view. These are not unique visitors or people. Clicks can repeat. Client reporting is approximate: blockers, nonconsent, network loss, bots and deliberate event spoofing affect totals. Reports measure attention, not revenue or sales popularity.

Events are batched, payloads are bounded, cross-origin requests are rejected, and a transactional global limit caps processing at about 20,000 metric events per Malawi day. Reports stop growing when the quota is reached. This is basic cost protection, not a bot-detection service; higher-traffic deployment should add platform rate limiting/App Check. Daily aggregate documents are retained until removed by the operator. Only the authorized admin API reads reports; existing deny-by-default Firestore rules protect these collections. Development runs discard metric writes. No historical traffic is backfilled.

## Event media

Event editors can attach up to six images/videos and choose the first as a cover. Accepted images: JPG/JPEG, PNG, WebP, GIF, AVIF, HEIC/HEIF, TIFF, BMP, SVG (25 MiB maximum). Accepted video containers: MOV, MP4, M4V, WebM (250 MiB maximum). RAW camera files, PSD and arbitrary file types are not supported.

HEIC/HEIF is converted in the browser using heic-to; TIFF uses UTIF's first frame. Static photos, SVG and BMP are rasterized/resized to WebP up to 2400 pixels; GIF animation is preserved. Images above 40 megapixels are rejected when dimensions can be decoded. HEIC conversion may be memory-intensive on mobile devices. Not every HEIF encoding is guaranteed to decode; unsupported files should be exported to JPEG. Original static image metadata is not retained after rasterization. Animated GIF files and video originals are stored without conversion.

Videos are uploaded in their original codec/container. MOV/HEVC videos may not play on all browsers. The public gallery provides an original-file link if playback fails; H.264 MP4 is the recommended cross-browser export. Video transcoding and captions are not automatic.

The server verifies the current administrator/editor role before issuing a resumable GCS upload session. Files travel directly to Storage in 8 MiB chunks, bypassing Vercel's request size limit. Retry logic queries the last committed byte. Finalization verifies stored size and content type before creating a public download token. This is authorization/metadata validation, not malware scanning or full server-side content decoding. Upload sessions are bearer capabilities and must not be shared.

Storage rules remain deny-by-default. Admin credentials authorize session creation, and download tokens authorize public reads. Bucket CORS has been configured for localhost:3000 and the two existing Vercel domains, preserving existing CORS settings. Website deployment remains pending. Only approved origins can request sessions through the app; add new production domains to both the endpoint allowlist and bucket CORS.

Limit: 100 upload sessions per user per UTC day. A finalization request expires after 24 hours. Orphaned incomplete/finished uploads, expired mediaUploads records, uploadQuota records, and files removed from events require periodic cleanup. Removing a media reference does not delete the file from Storage. Uploaded media is publicly accessible by its download URL, including draft event assets; avoid confidential media.

Verified with a temporary WebP upload through session creation, direct Storage transfer, finalization, CORS and public download; the test file and session record were removed afterward. Real HEIC/HEIF, TIFF and video files still need browser testing. Build, lint and media-format tests validate the code paths without claiming every device/codec combination is tested.
