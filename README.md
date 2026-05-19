# SSL Checker — Dashboard

Next.js app deployed on Vercel. The browser calls same-origin `/api/*`; the Next.js server proxies to your Express API using server-only `API_URL` (no VPS IP in the public repo).

## Setup

```bash
cp .env.example .env.local
# Edit API_URL to your API (e.g. http://localhost:3001 for local dev)
npm install
npm run dev
```

## Deploy (Vercel)

1. Connect this repo to Vercel.
2. **Project Settings → General:** Framework Preset = **Next.js**. **Output Directory must be empty** (not `dist` from the old Vite setup).
3. Set environment variable **`API_URL`** to your VPS API base URL (e.g. `http://146.59.237.166:3001`) — **Vercel dashboard only**, never commit it.
4. Redeploy. The dashboard will proxy `/api/*` to the API.

If the build succeeds but deploy fails with *"No Output Directory named dist"*, clear **Output Directory** in project settings and redeploy.

## Docs

[style-guide.md](docs/style-guide.md)
