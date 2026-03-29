# Deployment checklist (Vite + React)

This app is a static SPA using `HashRouter`, so it works from any base path without server-side rewrite rules for client routes.

## Build

```bash
npm ci
npm run build
```

Output: `dist/`.

## Static hosting

1. Upload the **contents** of `dist/` to the host root (or a subfolder if you use `base` in `vite.config`).
2. No Node process is required; use any static file host (Netlify, Vercel, GitHub Pages, S3 + CloudFront, nginx, etc.).
3. For **preview** locally after build: `npm run preview`.

## Environment

- If you add API base URLs later, use `import.meta.env.VITE_*` and set variables in the host’s dashboard or a `.env` file at build time (never commit secrets).

## HTTPS

Use the host’s default TLS termination so geolocation, camera, or PWA features remain viable if you add them later.
