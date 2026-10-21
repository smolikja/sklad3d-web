import { localeMeta, locales, localizedPathname } from "@/i18n/config";

/**
 * hreflang map for `alternates.languages`. Each locale points at its prefixed
 * URL (`/cs/...`, `/en/...`); `x-default` points at the unprefixed path, which
 * the proxy redirects to the visitor's best locale — the pattern Google
 * recommends for a language-agnostic entry point.
 */
export function languageAlternates(pathname = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeMeta[locale].hrefLang] = localizedPathname(locale, pathname);
  }
  languages["x-default"] = pathname;
  return languages;
}

/** Serializes JSON-LD safely for a native <script> tag (escapes `<` per docs). */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
