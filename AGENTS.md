<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

Follow `docs/stack-blueprint.md`: Server Components by default, small
`"use client"` islands, shadcn on Base UI (`src/components/ui`, generated —
regenerate with `pnpm dlx shadcn@latest add`, do not hand-edit), Tailwind v4
tokens in `src/app/globals.css` (semantic tokens only, never raw colours in
components), Vitest for tests. `pnpm check` must pass before every commit.

## Localization

All user-facing copy lives in `messages/<locale>.json`, typed by `Dictionary`
(`src/i18n/dictionary.ts`). Never hardcode strings — including `aria-label` and
`alt` — in components; add a key and pass it in via props. Structural data
(URLs, ids, asset paths, sizes, names) lives in `src/config/*`. See
`docs/localization.md`.

Czech is the source of truth and the voice is the collective's informal "we"
addressing the visitor as "ty". Make no claims the members have not confirmed
(prices, capacity, services); member bios are their own words.

Routing is always-prefixed (`/cs`, `/en`); `src/proxy.ts` (must stay in `src/`)
redirects the bare `/`. Metadata routes (`robots.ts`, `sitemap.ts`,
`manifest.ts`, `opengraph-image.tsx`) stay where they are.

## Members and assets

Members are configured in `src/config/members.ts` (order, names, links, media)
with copy in `messages/*.json` under `members.items.<id>`. Photos, video
posters and the studio photo are committed under `public/images/`; videos stay
on the media host and are referenced by URL. See `docs/assets.md` before adding
or replacing any file.

## Design

Dark only. The page is true black so the members' work sits on it without a
frame; mint (`--primary`) is the one interactive colour; the logo's RGB
subpixels (`--subpixel-*`) are reserved for the mark and the hero photo.
Section titles use `font-display` (Archivo expanded). The hero photo's channel
convergence is the page's single load animation — do not add per-section
entrance effects.
