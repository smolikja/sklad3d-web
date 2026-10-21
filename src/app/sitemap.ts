import type { MetadataRoute } from "next";

import { members } from "@/config/members";
import { siteConfig } from "@/config/site";
import { defaultLocale, localeMeta, locales, localizedPathname, type Locale } from "@/i18n/config";

// Bump when page content changes meaningfully.
const lastModified = new Date("2026-10-21T00:00:00.000Z");

function absoluteUrl(locale: Locale): string {
  return `${siteConfig.url}${localizedPathname(locale)}`;
}

// Shared hreflang map attached to every entry: each locale + an `x-default`
// pointing at the redirecting unprefixed root.
function alternates(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeMeta[locale].hrefLang] = absoluteUrl(locale);
  }
  languages["x-default"] = siteConfig.url;
  return languages;
}

// The member photos are listed with the page so image search can attribute
// them to SKLAD; videos stay on the media host and are not listed.
const images = members.flatMap((member) => [
  `${siteConfig.url}${member.avatar.src}`,
  ...member.media.map((item) =>
    `${siteConfig.url}${item.kind === "image" ? item.src : item.poster.src}`,
  ),
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: absoluteUrl(locale),
    lastModified,
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages: alternates() },
    images,
  }));
}
