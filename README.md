# Pure Voice

Pure Voice is a lightweight, browser-based singing practice playground (song library + favorites + pitch/coaching UI).

## Requirements

- Node.js (recommended: the version pinned by your environment; any modern Node 20+ should work)

## Scripts

- `npm install`
- `npm run dev` — start the dev server
- `npm run lint` — run ESLint
- `npm run build` — production build
- `npm run check` — quick CI-style check (lint + build)

## Microphone troubleshooting

- **Permissions:** click the lock icon in the address bar → allow Microphone. If you previously blocked it, reset the permission and reload.
- **Secure context:** most browsers require HTTPS (or `http://localhost`) for microphone access.
- **Device selection:** confirm the correct input is selected in your OS sound settings and/or the browser’s site settings.
- **Device busy:** close other apps/tabs using the mic (Zoom/Meet/Discord) and refresh.
- **Safari/iOS:** if it behaves oddly, try Chrome/Edge on desktop first to verify the mic works.
