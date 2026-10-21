# Stack blueprint

Reference snapshot of the toolchain, packages, configuration and conventions this
project follows. Taken 2026-09-14 from `studanky/studanky-web` (the sister project
that established the stack, also used by `smolikja.team`) and adopted here in
the 2026-10 rewrite; a few examples still mention that project's domain
(Strapi, store badges, `uqr`, newsletter). `package.json` and the committed
config files are the source of truth for this repository; this document
explains the intent behind them.

Differences in this repository: no Server Actions or Zod (the application is an
external form), no `motion` (the one load animation is pure CSS), and Embla
(`embla-carousel-react` + wheel gestures) for the member galleries.

Portable description of the toolchain, packages, configuration and conventions
used by `studanky-web` (snapshot: 2026-09-14). Copy this file into a new
repository and tell the coding agent: *"Set this project up according to
`stack-blueprint.md`."* Every version below is the one currently pinned in
`package.json`; bump them together rather than one at a time.

Design intent in one sentence: **Next.js App Router with Server Components by
default, shadcn on Base UI + Tailwind v4 for UI, typed JSON dictionaries for
i18n, Server Actions + Zod for mutations, Vitest for tests, pnpm + Node 24,
self-hosted through Coolify/Nixpacks.**

---

## 1. Runtime and toolchain

| Tool | Version | Pinned where | Notes |
| --- | --- | --- | --- |
| Node.js | 24 LTS (`>=24.0.0`) | `.nvmrc` = `24`, `package.json#engines`, `nixpacks.toml` = `nodejs_24` | nvm locally, Nixpacks in production |
| pnpm | 12.4.1 | `package.json#packageManager` (with sha512), `nixpacks.toml` | Activated through Corepack (`corepack enable`) |
| TypeScript | ^6.0.3 | devDependencies | Not 7.x yet: `typescript-eslint` peer range is `<6.1` and TS 7 ships no JS compiler API |
| ESLint | ^9 (flat config) | devDependencies | Not 10.x yet: `eslint-plugin-react` (via `eslint-config-next`) supports ≤ 9 |
| Vitest | ^5.0.0 | devDependencies | Node environment only; no jsdom |
| Tailwind CSS | ^4.3.3 | devDependencies | CSS-first config (`@theme`), PostCSS plugin |

`pnpm-workspace.yaml` (pnpm ≥ 10 blocks postinstall scripts unless approved):

```yaml
# Approve build (postinstall) scripts for trusted native dependencies.
allowBuilds:
  sharp: true # native libvips bindings; used by next/image optimization
  unrs-resolver: true # native resolver used by ESLint import resolution

# Keep every transitive @types/react* on the same release as the installed React.
overrides:
  "@types/react": 19.3.0
  "@types/react-dom": 19.3.0
```

---

## 2. Dependencies

### Runtime

| Package | Version | Role |
| --- | --- | --- |
| `next` | 16.3.5 | App Router, `output: "standalone"`, `proxy.ts` (formerly middleware), bundled docs in `node_modules/next/dist/docs/` |
| `react`, `react-dom` | 19.3.0 | `useActionState`, `use()`, no `forwardRef` |
| `@base-ui/react` | ^1.8.0 | Headless primitives behind shadcn (`base-nova` style). **Not Radix.** |
| `shadcn` | ^4.21.0 | CLI + `shadcn/tailwind.css` import; components are copied into `src/components/ui` |
| `class-variance-authority` | ^0.7.1 | `cva()` variant definitions in UI primitives |
| `clsx` + `tailwind-merge` | ^2.1.1 / ^3.7.0 | `cn()` helper in `src/lib/utils.ts` |
| `lucide-react` | ^1.45.0 | Icon set (declared in `components.json`) |
| `tw-animate-css` | ^1.4.0 | Enter/exit animation utilities for shadcn components |
| `motion` | ^13.2.0 | Scroll reveal and micro-interactions; import from `"motion/react"` (**not** `framer-motion`) |
| `zod` | ^4.6.4 | Server-side validation; use Zod 4 idioms (`z.email()`, `{ error }`) |
| `uqr` | ^0.1.3 | Dependency-free QR code generation (SVG) |

### Development

| Package | Version |
| --- | --- |
| `@tailwindcss/postcss`, `tailwindcss` | ^4.3.3 |
| `typescript` | ^6.0.3 |
| `eslint`, `eslint-config-next` | ^9, 16.3.5 (keep `eslint-config-next` on the exact Next version) |
| `vitest` | ^5.0.0 |
| `@types/node` | ^24.13.4 (match the runtime major) |
| `@types/react`, `@types/react-dom` | 19.3.0 (exact, mirrored in `overrides`) |

### Deliberately not used

No Vercel platform features, no Radix, no next-intl/i18next, no react-hook-form,
no CSS-in-JS, no ORM/database in the web app (data comes from a Strapi REST
API), no Playwright/E2E yet, no CI workflow yet (`pnpm check` is run locally and
by the Nixpacks build).

---

## 3. Bootstrap a new project

```bash
# Node + pnpm
nvm install 24 && nvm use 24 && corepack enable
echo "24" > .nvmrc

# Next.js (App Router, TS, Tailwind v4, ESLint, src/ dir, Turbopack)
pnpm create next-app@latest my-app --ts --tailwind --eslint --app --src-dir --use-pnpm
cd my-app

# shadcn on Base UI — the `base-nova` preset (Base UI primitives, lucide icons,
# neutral base colour). `--base base` selects Base UI over Radix/React Aria.
pnpm dlx shadcn@latest init --base base --preset base-nova
pnpm dlx shadcn@latest add button input label textarea card badge separator dialog sheet tooltip accordion field

# remaining runtime deps
pnpm add motion zod uqr tw-animate-css
# dev deps
pnpm add -D vitest typescript@^6 @types/node@^24
```

Then apply the configuration files from section 4 and pin `packageManager`
(`corepack use pnpm@12.4.1` writes it).

---

## 4. Configuration files

### `package.json` (scripts and pins)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit --incremental false",
    "test": "vitest run",
    "test:watch": "vitest",
    "docs:check": "node scripts/check-docs.mjs",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm docs:check"
  },
  "packageManager": "pnpm@12.4.1+sha512.…",
  "engines": { "node": ">=24.0.0" }
}
```

`pnpm check` is the single pre-commit / pre-deploy gate.

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Root layout lives under a dynamic segment (app/[locale]/layout.tsx), so a
    // fully server-rendered, localized 404 needs app/global-not-found.tsx.
    globalNotFound: true,
    serverActions: {
      // Keep the parser limit close to the largest expected payload.
      bodySizeLimit: "32kb",
    },
  },
};

export default nextConfig;
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules"]
}
```

### `eslint.config.mjs`

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

### `vitest.config.mts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

### `postcss.config.mjs`

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

### `components.json` (shadcn)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

### `.gitignore` additions on top of the create-next-app default

```gitignore
.env*
!.env.example

# vitest reports and artifacts
.vitest/
```

### `.env.example`

Document every variable with a comment block (purpose, required/optional,
what degrades when it is missing). Production values live in the hosting
platform, never in git. Server-only variables have no `NEXT_PUBLIC_` prefix and
are read only from server code (`"server-only"` modules, Server Actions, route
handlers).

---

## 5. Styling system

### `src/app/globals.css` skeleton

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Map shadcn semantic tokens to Tailwind utilities */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* …card, popover, secondary, muted, accent, destructive, border, input, ring, chart-*, sidebar-* … */

  /* Fonts come from next/font CSS variables set on <html> */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);

  /* Radius scale derived from one --radius */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);

  /* Project-specific brand tokens follow the same pattern */
  --color-water: var(--water);
  --color-water-foreground: var(--water-foreground);

  /* Custom keyframe animations registered as utilities */
  --animate-float: float 7s ease-in-out infinite;
}

:root {
  color-scheme: light;
  /* All colours in oklch; --primary is a darker step of the brand hue so text keeps AA contrast */
  --background: oklch(0.977 0.005 240);
  --foreground: oklch(0.245 0.03 250);
  --primary: …;
  --radius: 0.75rem;
}
```

Rules: colours in `oklch`, semantic tokens only (never raw hex in components),
brand tokens added next to the shadcn ones, animations declared in `@theme`.

### Fonts — `src/lib/fonts.ts`

```ts
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const fontVariables = [geistSans.variable, geistMono.variable].join(" ");
// <html className={`${fontVariables} h-full antialiased`}>
```

### Component primitives

`src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

UI primitives in `src/components/ui/*` are shadcn-generated: Base UI primitive +
`cva()` variants + `cn()`. Never hand-edit their API; regenerate with
`pnpm dlx shadcn@latest add <name>` and customise through tokens or wrappers.

### Motion

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children, delay = 0, className }) {
  if (useReducedMotion()) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
```

Animate only `transform`/`opacity`, respect `prefers-reduced-motion`, keep
motion in small client islands.

---

## 6. Project structure and conventions

```text
src/
  app/                  routes, layouts, metadata files, route handlers, Server Actions
    [locale]/           localized pages (layout.tsx owns <html lang>, fonts, metadata)
    global-not-found.tsx
    actions/            Server Actions ("use server" + "server-only")
    robots.ts  sitemap.ts  manifest.ts  icon.png  apple-icon.png
  components/
    ui/                 shadcn primitives (generated)
    <subsystem>/        feature components grouped by subsystem, not by route
  config/               locale-independent structural data (site URLs, ids, assets, legal versions)
  i18n/                 config.ts, dictionary.ts (types), dictionaries.ts (loader), format.ts
  lib/                  shared server/domain utilities, fonts, og-image helpers
  types/                cross-subsystem contracts
  proxy.ts              Next 16 proxy (must stay in src/)
messages/               <locale>.json + validate.ts
docs/                   architecture, localization, integrations, deployment …
scripts/check-docs.mjs  validates relative Markdown links
public/                 static assets
```

- **Server Components by default.** Client Components (`"use client"`) only
  for browser state/effects/events, kept as small islands. Props crossing the
  boundary must be serializable; Server Actions are the one function exception.
- **No internal Route Handlers for your own data.** Read in Server Components,
  mutate through Server Actions. Route Handlers exist only for public HTTP
  contracts (association files, redirects).
- **Server-only integration modules** import `"server-only"`.
- **Structural data in `src/config/`, copy in `messages/`.** Never mix them.
- **Path alias** `@/*` → `src/*`.
- **Comments and documentation in English**; user-facing copy stays localized.

---

## 7. Localization pattern

- Always-prefixed routes (`/cs`, `/en`); the bare `/` redirects in `src/proxy.ts`
  using cookie `NEXT_LOCALE` → `Accept-Language` → `defaultLocale`.
- `src/i18n/config.ts`: `locales` tuple, `Locale` type, `isLocale()`,
  `localeMeta` (`htmlLang`, `ogLocale`, `hrefLang`), `localizedPathname()`,
  `matchAcceptLanguage()` with bounded, q-value-aware parsing.
- `src/i18n/dictionary.ts`: one `Dictionary` type describing the whole catalog.
- `messages/validate.ts`: `export const catalogs: DictionaryCatalog[] = [cs, en];`
  — never imported at runtime; makes `tsc` fail on a missing key.
- `src/i18n/dictionaries.ts`: lazy `import("../../messages/<locale>.json")` in
  Server Components only, so catalogs never reach the client bundle.
- `format(template, values)` for `{placeholder}` templates.
- Never hardcode user-facing strings in components — including `aria-label`
  and `alt`; pass copy in via props.
- Exclude from the proxy matcher: `_next`, `api`, `.well-known`, metadata
  files, anything with a file extension, and unprefixed deep-link routes.

---

## 8. Mutations: Server Action + Zod

Pattern used by the newsletter signup (`src/app/actions/newsletter.ts`):

1. `"use server"` + `import "server-only"`.
2. Read `FormData` defensively (`typeof value === "string"`).
3. Validate with Zod 4 (`z.email()`), return a discriminated state object
   `{ status: "idle" | "success" | "invalid" | "error" }` — never throw to the client.
4. Honeypot field (off-screen `website` input) → silently succeed.
5. Process-local IP rate limiting (`Map` buckets, hashed IP via `node:crypto`).
6. `fetch` upstream with an `AbortSignal.timeout(5000)`; secrets never leave the server.
7. Client: `const [state, formAction, pending] = useActionState(action, initialState)`.

`next.config.ts` caps `serverActions.bodySizeLimit` to the expected payload.

---

## 9. Metadata, SEO and PWA

- `generateMetadata` in `[locale]/layout.tsx`: `metadataBase`, title template
  `%s | Site`, `applicationName`, `manifest`, `appleWebApp`, `formatDetection`,
  optional `itunes.appId`. Page-identity metadata (canonical, `alternates.languages`,
  `robots`, OpenGraph URL) lives in `page.tsx`, not the layout, so 404s do not
  inherit it.
- `export const viewport: Viewport = { themeColor, colorScheme, … }`.
- File conventions: `robots.ts`, `sitemap.ts`, `manifest.ts`, `icon.png`,
  `apple-icon.png`, `opengraph-image.tsx` (via `next/og` `ImageResponse`,
  `generateImageMetadata` for per-locale alt/size).
- `siteConfig.url` is the single canonical origin used by all of the above.

---

## 10. Testing

- Vitest 5, `environment: "node"`, tests colocated as `src/**/*.test.ts`.
- Pure logic (i18n negotiation, URL helpers, data normalisation) is unit tested;
  UI is not snapshot-tested.
- Proxy/middleware matchers are tested with
  `next/experimental/testing/server` (`unstable_doesMiddlewareMatch`, `getRedirectUrl`).
- Server-only modules are tested by `vi.mock("server-only", () => ({}))` and
  injecting `fetch` mocks (`vi.fn<typeof fetch>()`).
- Runtime verification during development: `next-dev-loop` skill
  (`/_next/mcp` + `agent-browser`), see section 13.

---

## 11. Documentation and agent files

- `README.md`: purpose, docs index, requirements, local dev, environment table,
  command table, architecture at a glance.
- `docs/*.md`: durable contracts and procedures only (architecture,
  localization, integrations, deployment, assets). Active work goes to the
  issue tracker; implementation details stay in code.
- `scripts/check-docs.mjs` validates relative links in every Markdown file;
  wired into `pnpm check`.
- `AGENTS.md` at the root: the Next.js managed block
  (`<!-- BEGIN:nextjs-agent-rules --> … <!-- END:nextjs-agent-rules -->`, written
  by `next dev` on 16.3+, commit its updates) followed by project rules
  (localization, routing, what must not move). `CLAUDE.md` contains only
  `@AGENTS.md`.

---

## 12. Deployment: Coolify + Nixpacks

`nixpacks.toml`:

```toml
[variables]
COREPACK_ENABLE_DOWNLOAD_PROMPT = "0"
HOSTNAME = "0.0.0.0"
NEXT_TELEMETRY_DISABLED = "1"
NODE_ENV = "production"
NPM_CONFIG_PRODUCTION = "false"

[phases.setup]
nixPkgs = ["nodejs_24"]

[phases.install]
cmds = [
  "corepack enable",
  "corepack prepare pnpm@12.4.1 --activate",
  "pnpm install --frozen-lockfile",
]
cacheDirectories = ["/root/.local/share/pnpm/store"]
paths = ["/app/node_modules/.bin"]

[phases.build]
cmds = [
  "pnpm run build",
  "mkdir -p .next/standalone/.next",
  "cp -R public .next/standalone/",
  "cp -R .next/static .next/standalone/.next/",
]
cacheDirectories = [".next/cache", "node_modules/.cache"]

[start]
cmd = "node .next/standalone/server.js"
```

Coolify: build pack Nixpacks, port 3000, static site disabled, runtime env vars
set in the dashboard. The pnpm version in `nixpacks.toml` **must** equal
`packageManager` in `package.json`, otherwise Corepack refuses to start.
Pre-deploy gate: `pnpm check && pnpm build`.

---

## 13. Agent tooling (global, `~/.agents/skills`)

Install once per machine with the `skills` CLI; Node 24 is required for
`agent-browser`.

```bash
# Core for this stack
npx skills add vercel-labs/agent-skills -g -s vercel-react-best-practices vercel-composition-patterns web-design-guidelines -y
npx skills add shadcn/ui -g -s shadcn -y
npx skills add pproenca/dot-skills -g -s framer-motion -y      # built on motion.dev docs
npx skills add prowler-cloud/prowler -g -s zod-4 -y             # Zod 4 idioms
npx skills add antfu/skills -g -s vitest pnpm -y
npx skills add addyosmani/web-quality-skills -g -s seo accessibility core-web-vitals -y
npx skills add ibelick/ui-skills -g -s fixing-metadata fixing-motion-performance create-design-md -y
npx skills add anthropics/skills -g -s frontend-design -y
npx skills add wshobson/agents -g -s tailwind-design-system -y

# Runtime verification loop (Next 16.3+ with Turbopack)
npm i -g agent-browser@latest && agent-browser install
npx skills add vercel-labs/agent-browser -g -s agent-browser -y
npx skills add vercel/next.js -g -s next-dev-loop -y
# optional: npx skills add vercel/next.js -g -s next-cache-components-adoption -y

# keep them fresh
npx skills update -g -y
```

Avoid: `next-best-practices` (deprecated upstream — the bundled docs replace it),
`framer-motion-animator` (imports `framer-motion`), `pproenca/dot-skills@zod`
(Zod 3 idioms), any "Next.js 14" pattern skill.

Optional MCP for live Lighthouse audits used by the `seo`/`accessibility`/
`core-web-vitals` skills: `claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest`.

---

## 14. Git conventions

- Conventional, lowercase subjects: `feat: …`, `fix: …`, `docs: …`,
  `refactor: …`, `chore: …`, `revert: …`; releases as `bump version X.Y.Z`.
- Commit the lockfile, `.nvmrc`, `pnpm-workspace.yaml` and the Next.js
  managed block in `AGENTS.md`.
- `pnpm check` must pass before every commit that touches code or docs.

---
