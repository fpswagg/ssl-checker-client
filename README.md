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
2. Set environment variable **`API_URL`** to your VPS API base URL (e.g. `http://146.59.237.166:3001`) — **Vercel dashboard only**, never commit it.
3. Deploy. The dashboard at `https://sslchecker.fpswagg.site` will proxy `/api/*` to the API.

## Docs

[style-guide.md](docs/style-guide.md)
