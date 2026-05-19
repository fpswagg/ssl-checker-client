# AGENTS.md — SSL Checker Dashboard

Standalone Vite + React SPA. Deploy `dist/` to any static host.

## Stack

Vite, React, React Router, Tailwind 4, Sawabo CSS tokens.

## Layout

```
src/           Pages and components
docs/          UI style guide
```

## Invariants

1. API URL from `VITE_API_URL` at build time.
2. JWT stored in `localStorage` (`ssl-checker-token`).
3. Use semantic CSS variables from `src/index.css`; 2px radius.

## Commands

```bash
npm install
cp .env.example .env
npm run dev
npm run build   # deploy dist/
```

## Docs

[docs/style-guide.md](docs/style-guide.md)

## Related repo

Backend API is a **separate repository**. Set `VITE_API_URL` to that API origin.
