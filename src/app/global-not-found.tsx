import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { SkladLogo } from "@/components/icons/sklad-logo";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { isLocale, localeMeta, localizedPathname, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestLocale } from "@/i18n/request-locale";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

// Global 404 for URLs that match no route. Enabled via `experimental.globalNotFound`
// in next.config. Because the root layout sits under the dynamic `[locale]`
// segment, a normal `not-found.tsx` can't be composed with a localized <html lang>;
// this file renders the whole document itself and is fully server-rendered (works
// without JS). Next injects a 404 status and `noindex` automatically.

// The locale comes from the `x-locale` header the proxy sets from the URL prefix
// (so `/cs/…` renders Czech), falling back to the visitor's preferred locale.
async function resolveLocale(): Promise<Locale> {
  const fromUrl = (await headers()).get("x-locale");
  if (isLocale(fromUrl)) return fromUrl;
  return getRequestLocale();
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: siteConfig.themeColor,
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale());
  // Next injects `noindex` automatically for the 404 status, so only the
  // localized title/description are set here.
  return {
    title: `${dict.notFound.title} | ${siteConfig.name}`,
    description: dict.notFound.description,
  };
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const copy = (await getDictionary(locale)).notFound;

  return (
    <html lang={localeMeta[locale].htmlLang} className={`dark ${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
          <div className="flex w-full max-w-lg flex-col items-start gap-8">
            <SkladLogo className="h-8" />
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">404</p>
              <h1 className="font-display text-4xl text-balance sm:text-5xl">{copy.title}</h1>
              <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
                {copy.description}
              </p>
            </div>
            <Link
              href={localizedPathname(locale)}
              className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-lg px-6 text-base font-semibold")}
            >
              {copy.backHome}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
