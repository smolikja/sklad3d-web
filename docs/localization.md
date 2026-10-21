# Localization

The site uses always-prefixed content URLs and typed JSON message catalogs.
All user-facing copy, including accessible names and image descriptions,
lives in `messages/<locale>.json`.

## Sources of truth

- `src/i18n/config.ts` defines supported locales, locale metadata, the default
  fallback and `Accept-Language` matching.
- `src/i18n/dictionary.ts` defines the complete `Dictionary` shape. Member ids
  come from `src/config/members.ts`, benefit and navigation ids from
  `src/config/site.ts`, so a catalog cannot miss or misname one.
- `src/i18n/dictionaries.ts` lazily loads catalogs for Server Components and
  cross-checks every member's link and media ids against
  `src/config/members.ts`.
- `messages/validate.ts` makes TypeScript validate every catalog at compile
  time.
- `src/i18n/format.ts` renders strings containing `{placeholder}` tokens.

Only localized prose belongs in catalogs. URLs, ids, image paths, names and
nicknames, the address used in structured data and other locale-independent
structure belong in `src/config/`. Brand names such as Instagram and Discord
are structural too.

## Add or change copy

1. Add or change the key in the `Dictionary` type.
2. Update the same key in every `messages/*.json` catalog.
3. Pass the smallest relevant dictionary subtree from the Server Component to
   the component that renders it.
4. Render template placeholders with `format()` rather than manual replacement.
5. Run `pnpm typecheck`; a missing, misspelled or structurally incompatible key
   fails in `messages/validate.ts`.

Do not hardcode visible strings, `aria-label` values or `alt` text in
components.

## Member copy

`members.items.<id>` holds what is written about a member:

- `role` — one line under the name.
- `bio` — paragraphs. Two inline constructs are supported and nothing else:
  `**text**` highlights a project or discipline, `[label](https://…)` is an
  external link. They are parsed by `src/lib/inline-markup.ts` and rendered as
  React elements, never as HTML.
- `links` — one visible label per link id in the config.
- `media` — one description per media id. It is the image's alt text, the
  slide's accessible name and the lightbox caption, so describe what is shown
  and name the piece when it has a title.

Bios are the members' own words. Translate them faithfully and send changes
to the member before publishing.

## Add a locale

1. Add the locale to `locales` and its HTML, Open Graph and `hreflang`
   metadata to `localeMeta` in `src/i18n/config.ts`.
2. Add `messages/<locale>.json` with the complete `Dictionary` shape.
3. Register the catalog in `src/i18n/dictionaries.ts` and
   `messages/validate.ts`.
4. Run `pnpm check` and `pnpm build` to verify catalog typing and generated
   routes.

Static params, canonical and alternate metadata, the sitemap, the language
switcher and proxy matching derive from the locale configuration. They should
not maintain separate locale lists.

## Voice

Czech is the editorial source of truth: the collective speaks as "we" and
addresses the visitor informally ("ty"). English carries the same intent in
plain, friendly language. The one primary action reads the same wherever it
appears (`nav.apply`, `hero.apply`, `callout.apply`). Do not add claims the
members have not confirmed.

## Routing and language negotiation

Localized content always has a prefix: `/cs` and `/en`. The bare `/` and any
unprefixed localizable path redirect according to this order:

1. A valid `NEXT_LOCALE` preference cookie.
2. The best supported `Accept-Language` value (q-values honoured, tags
   canonicalized, at most 20 entries parsed).
3. `defaultLocale` (`cs`).

Visiting a prefixed URL (re)sets the cookie for one year, which is how the
language switcher's plain links persist the choice. On prefixed paths the
proxy also forwards the locale as the `x-locale` request header so the global
404 can localize itself to match the URL.

Keep `src/proxy.ts` in `src/` beside the App Router. Moving it to the
repository root would prevent this project layout from applying the proxy
convention.
