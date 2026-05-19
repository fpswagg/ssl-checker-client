# AGENTS.md — SSL Checker Dashboard

Next.js App Router. Deploy on Vercel.

## Stack

Next.js 15, React 19, Tailwind 4, Sawabo CSS tokens.

## Layout

```
app/              Routes and API proxy (app/api/[...path]/route.ts)
components/       UI components
lib/              api.ts, types.ts
docs/             UI style guide
```

## Invariants

1. Browser calls relative `/api/*` only — never embed VPS IP or `API_URL` in client code.
2. `API_URL` is server-only (Vercel env / `.env.local`).
3. JWT in `localStorage` (`ssl-checker-token`).
4. Semantic CSS variables from `app/globals.css`; 2px radius.

## Commands

```bash
npm install
cp .env.example .env.local
npm run dev
npm run build
```

## Docs

[docs/style-guide.md](docs/style-guide.md)

## Related repo

Backend API is a **separate repository**. Set `API_URL` to that API origin in Vercel / `.env.local`.
