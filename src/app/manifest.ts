import type { MetadataRoute } from "next";

import { brandAssets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { defaultLocale, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// A web app manifest is single-language; it is rendered in the default locale.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const dict = await getDictionary(defaultLocale);

  return {
    id: "/",
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: dict.manifest.description,
    lang: localeMeta[defaultLocale].hrefLang,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    icons: Object.values(brandAssets.icons).map((icon) => ({ ...icon })),
  };
}
