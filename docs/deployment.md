# Deployment

Production is self-hosted through Coolify using Nixpacks and the Next.js
standalone server output, the same setup as `smolikja.team`. The committed
configuration files are authoritative; this document explains how they fit
together and what to verify around a release.

## Build and runtime

`next.config.ts` enables `output: "standalone"`. `nixpacks.toml`:

1. installs Node.js 24;
2. activates the pnpm version pinned in `package.json` through Corepack;
3. installs dependencies with the frozen lockfile;
4. runs `pnpm build`;
5. copies `public/` and `.next/static/` into the standalone output; and
6. starts `node .next/standalone/server.js` on `0.0.0.0:3000`.

The copies in step 5 are required because Next.js does not include those asset
directories in standalone output automatically. `pnpm start` remains useful for
testing a regular production build locally, but it is not the deployed start
command.

The pnpm version in `nixpacks.toml` (`corepack prepare pnpm@…`) must equal the
`packageManager` field in `package.json`; otherwise Corepack aborts the build.
Bump both together.

A server (rather than a static export) is needed for two things: the locale
redirect of `/` in `src/proxy.ts` and the image optimizer behind `next/image`,
which serves the committed photos as AVIF/WebP at the right size. The pages
themselves are prerendered.

Coolify settings:

| Setting | Value |
| --- | --- |
| Build pack | Nixpacks |
| Build / start command | Not set in Coolify — they come from `nixpacks.toml` |
| Exposed port | `3000` |
| Static site | Disabled |
| Health check | Coolify default container check (there is no `/health` route) |
| Runtime environment | None required |

## Domain

`siteConfig.url` (`src/config/site.ts`) is the canonical origin used by
metadata, the sitemap, `robots.txt`, structured data and the share image.
Point `sklad.digital` at the Coolify service before launch, and redirect any
other host (for example `www.`) to it.

## Pre-deploy checks

1. Install from the committed lockfile and run:

   ```bash
   pnpm check
   pnpm build
   ```

2. Review `src/config/site.ts` for the canonical URL, the application form and
   the external links.
3. If page content changed meaningfully, bump `lastModified` in
   `src/app/sitemap.ts`.

## Post-deploy checks

- `/` redirects to a supported locale; `/cs` and `/en` render.
- An unknown path such as `/cs/nothing` returns a localized 404 with status
  `404`.
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/icon.png` and
  `/cs/opengraph-image/og` respond with `200`.
- A member photo loads through `/_next/image` as AVIF or WebP, and a gallery
  video starts playing when scrolled into view.
- Security headers from `next.config.ts` are present
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Share the URL in a messenger and check the preview card.

## History

Until 2026-10 the site was a static `index.html` composed from HTML partials by
`scripts/build.js`, with member images hot-linked from the media host. The
rewrite moved it to this stack and the images into `public/images/`.
