# Style guide (Sawabo)

## Purpose

Visual and UX rules for the React dashboard. Tokens live in CSS variables, not one-off hex in components.

## Key files

- Tokens: [`../src/index.css`](../src/index.css)
- Theme toggle: [`../src/components/ThemeToggle.tsx`](../src/components/ThemeToggle.tsx)
- UI primitives: [`../src/components/ui/`](../src/components/ui/)

## Related docs

- API architecture: see the **ssl-checker API repository** `docs/architecture.md`.

---

## Principles

- **Corners**: 2px max (`border-radius: 2px` globally)
- **Panels**: `.arcade-panel`, `.arcade-frame` for framed UI
- **Colors**: semantic vars `--bg`, `--surface`, `--text`, `--primary`, `--accent`, `--ring`
- **Type**: Inter body; JetBrains Mono for `.mono-meta`; Press Start 2P only for `.display-pixel` labels
- **Voice**: short UI copy, no exclamation marks, imperative buttons

## Themes

- Default dark: `data-theme="dark"` on `<html>`
- Toggle persists `sawabo-theme` in `localStorage`
- Light/dark share the same token names

## Status colors

Use classes `status-ok`, `status-warning`, `status-error` with text labels — never color alone.

## Email HTML

Transactional templates use light theme tokens (Bone bg, Ink text) for client compatibility.
