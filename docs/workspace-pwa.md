# Staff workspace app

Share the live site's **/admin** URL with staff. The login page and workspace
Settings contain an installation/help button and **Share workspace link**.
The share button uses the device share sheet, then clipboard when unavailable,
and finally a selectable URL if clipboard access fails. It never shares credentials.

The app installs as **Khichini Hub Workspace** (short name **Khichini Staff**),
starts at /admin, and retains the existing Firebase login and role enforcement.
Installation does not create an account or grant access. Editing requires a connection.

## Installation

- Android Chrome/Edge: use **Install workspace** when the browser offers it,
  or the browser menu's Install app / Add to Home screen option.
- iPhone/iPad: open the workspace link in Safari, choose Share → Add to Home Screen,
  enable Open as Web App if shown, and tap Add.
- In-app messaging browsers may not support installation; open the link in the
  device browser first.
- HTTPS is required outside localhost. Device/browser engagement and installation
  state affect when the native installation option appears.
- Once opened as an installed app, installation controls are hidden; staff can
  still share the workspace link.

The site provides no install UI or manifest on public menu pages. Browsers may
independently offer their generic bookmark/add-to-home-screen features.

## Implementation and boundaries

Only the admin layout links /admin/manifest.webmanifest and mounts installation
listeners. The manifest id, start URL, and scope are /admin. An explicit route
serves the nested manifest with application/manifest+json.

The service worker is registered at /admin/sw.js with scope /admin.
Service-Worker-Allowed permits that scope to include the exact /admin login URL.
It handles workspace GET navigations only, always tries the network, and returns
a static offline explanation on network failure. It does not cache pages, tokens,
API responses, mutations, images, or menu edits; it does not intercept public routes.
Updates do not require reinstalling.

Icons derive from public/Khichinihublogo.png with an opaque #fbf7ee cream background:
192px and 512px standard icons, a padded 512px maskable icon, and a 180px Apple
touch icon. The maskable logo stays inside the central safe area for device masks.

## Verification

Automated checks cover manifest scope and worker interception/offline behavior.
Production HTTP checks verify manifest/icon availability, worker headers, and the
absence of manifest links on public routes. Mobile browser checks cover the login
installation card, expandable help, and client navigation back to the public menu.
Actual Android and iPhone installation should be checked on the HTTPS deployment.

References:
- https://web.dev/learn/pwa/installation
- https://web.dev/learn/pwa/installation-prompt
- https://support.apple.com/en-mide/guide/iphone/iphea86e5236/ios
