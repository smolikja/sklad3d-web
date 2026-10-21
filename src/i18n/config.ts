/**
 * Central i18n configuration. Framework-agnostic and safe to import from
 * anywhere (proxy, server components, client components) — it holds no secrets
 * and pulls in no server-only APIs.
 */

export const locales = ["cs", "en"] as const;

export type Locale = (typeof locales)[number];

type RankedLanguageTag = {
  languageTag: string;
  quality: number;
  index: number;
};

/**
 * Fallback locale. Every locale is prefixed in the URL (`/cs`, `/en`), so the
 * default is *not* privileged in the routing — it is only the locale that the
 * bare `/` redirects to when nothing else is known. Changing it is therefore a
 * one-line change with no URL migration.
 */
export const defaultLocale: Locale = "cs";

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (locales as readonly string[]).includes(value);
}

/**
 * Per-locale metadata used across the app: the `<html lang>` value, the
 * OpenGraph locale, and the hreflang tag. Kept here so adding a language is a
 * single-file change.
 */
export const localeMeta: Record<
  Locale,
  { htmlLang: string; ogLocale: string; hrefLang: string }
> = {
  cs: { htmlLang: "cs", ogLocale: "cs_CZ", hrefLang: "cs-CZ" },
  en: { htmlLang: "en", ogLocale: "en_US", hrefLang: "en" },
};

/**
 * Builds the public URL path for a locale under the "always-prefix" scheme:
 * every locale (including the default) is prefixed — `/cs`, `/en`, `/en/foo`.
 * The bare `/` is not a content URL; it redirects (see the proxy).
 */
export function localizedPathname(locale: Locale, pathname = "/"): string {
  const rest = pathname === "/" ? "" : pathname;
  return `/${locale}${rest}`;
}

/**
 * Splits a public pathname into its (optional) locale prefix and the remainder.
 * `/en/foo` -> { locale: "en", pathname: "/foo" }, `/foo` -> { locale: default,
 * pathname: "/foo" }.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  pathname: string;
} {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (isLocale(maybeLocale)) {
    const rest = "/" + segments.slice(2).join("/");
    return { locale: maybeLocale, pathname: rest === "/" ? "/" : rest.replace(/\/$/, "") };
  }
  return { locale: defaultLocale, pathname };
}

const QVALUE_RE = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/;
const MAX_ACCEPT_LANGUAGE_ENTRIES = 20;

/** Returns one canonical BCP 47 tag or null for malformed/unbounded input. */
export function canonicalLanguageTag(tag: string): string | null {
  if (tag.length === 0 || tag.length > 255) return null;

  try {
    return Intl.getCanonicalLocales(tag)[0] ?? null;
  } catch {
    return null;
  }
}

function qualityFromParameters(parameters: readonly string[]): number | null {
  const parameter = parameters
    .map((value) => value.trim())
    .find((value) => value.toLowerCase().startsWith("q="));
  if (!parameter) return 1;

  const rawQuality = parameter.slice(2);
  return QVALUE_RE.test(rawQuality) ? Number(rawQuality) : null;
}

/** Parses, canonicalizes, and stably ranks valid `Accept-Language` entries. */
function rankedLanguageTags(
  header: string | null | undefined,
): RankedLanguageTag[] {
  if (!header) return [];

  const ranked: RankedLanguageTag[] = [];
  // Bound synchronous Intl parsing in the proxy hot path for hostile headers.
  for (const [index, part] of header.split(",", MAX_ACCEPT_LANGUAGE_ENTRIES).entries()) {
    const [rawTag, ...parameters] = part.trim().split(";");
    const languageTag = canonicalLanguageTag(rawTag.trim());
    const quality = qualityFromParameters(parameters);
    // q=0 means "not acceptable"; malformed qvalues invalidate that entry.
    if (!languageTag || quality === null || quality === 0) continue;
    ranked.push({ languageTag, quality, index });
  }

  return ranked.sort((a, b) => b.quality - a.quality || a.index - b.index);
}

function localeForLanguageTag(languageTag: string): Locale | null {
  const normalizedTag = languageTag.toLowerCase();
  const primary = normalizedTag.split("-")[0];
  return (
    locales.find((candidate) => candidate === normalizedTag || candidate === primary) ??
    null
  );
}

/** Resolves the supported UI locale from an `Accept-Language` header. */
export function matchAcceptLanguage(header: string | null | undefined): Locale {
  for (const { languageTag } of rankedLanguageTags(header)) {
    const locale = localeForLanguageTag(languageTag);
    if (locale) return locale;
  }

  return defaultLocale;
}
