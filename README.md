# sklad.digital

Website of SKLAD — a shared studio and collective for 3D, motion, audiovisual
and software creators in Prague-Smíchov. A single localized landing page
(`/cs`, `/en`) that explains how membership works, introduces the members and
their work, lists what the studio offers, links the community channels,
answers common questions and invites visitors to apply for a tour.

The application uses the Next.js App Router, React, TypeScript, Tailwind CSS
and shadcn on Base UI, managed with pnpm. `package.json` is the source of truth
for framework and dependency versions;
[`docs/stack-blueprint.md`](docs/stack-blueprint.md) explains the intent
behind them.

## Documentation

- [Architecture](docs/architecture.md) — routes, component boundaries, data
  flow, styling and source-code ownership.
- [Web assets](docs/assets.md) — where photos, posters and videos live, how to
  prepare them, and how to add a member.
- [Localization](docs/localization.md) — typed catalogs, member copy, adding a
  locale and locale-aware routing.
- [Deployment](docs/deployment.md) — standalone build, Coolify/Nixpacks
  configuration and release checks.
- [Stack blueprint](docs/stack-blueprint.md) — the toolchain and conventions
  shared with the sister projects.

## Requirements

- Node.js `>=24.0.0` (see `.nvmrc`)
- pnpm 12, pinned by the `packageManager` field in `package.json`
- Corepack, recommended for activating the pinned pnpm version

## Local development

```bash
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The bare `/` redirects to
`/cs` or `/en`. No environment variables are needed.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Run a regular production build locally. |
| `pnpm lint` | Run ESLint. |
| `pnpm typecheck` | Run TypeScript without emitting files. |
| `pnpm test` | Run the Vitest suite once. |
| `pnpm docs:check` | Validate relative links in project Markdown files. |
| `pnpm check` | Run lint, type checking, tests and documentation validation. |

## Architecture at a glance

- `src/app/` owns the localized page, metadata, structured data, the share
  image and the global 404.
- Server Components are the default. Small client islands own the mobile menu,
  the member galleries with their lightbox and video previews, and the FAQ
  accordion.
- `src/config/` holds structural data — site links, address, members and their
  media; `messages/` holds the copy in Czech and English.
- `public/images/` holds member photos, video posters and the studio photo;
  videos stay on the media host. See [Web assets](docs/assets.md).
