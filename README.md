# SSL Checker — Dashboard

Vite + React SPA. Build and deploy static files to any host; point at your API with `VITE_API_URL`.

## Setup

```bash
cp .env.example .env
npm run dev
```

## Production build

```bash
# Set API URL at build time
echo 'VITE_API_URL=https://api.yourdomain.com' > .env
npm run build
# Deploy dist/ to your static host
```

Set `CORS_ORIGIN` on the API to your dashboard origin.

## Docs

[style-guide.md](docs/style-guide.md)
