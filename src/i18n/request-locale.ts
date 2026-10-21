import { cookies, headers } from "next/headers";
import { cache } from "react";

import { isLocale, matchAcceptLanguage, type Locale } from "./config";

const LOCALE_COOKIE = "NEXT_LOCALE";

async function resolveRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const headerStore = await headers();
  return matchAcceptLanguage(headerStore.get("accept-language"));
}

/**
 * Resolves the best UI locale for routes outside the `[locale]` segment (the
 * global 404), where there is no `params.locale` to read: a valid
 * `NEXT_LOCALE` cookie (set by the proxy) wins, then `Accept-Language`, then
 * the default. Memoized once per request so `generateMetadata` and the page
 * agree. Reading these request APIs opts the caller into dynamic rendering.
 */
export const getRequestLocale = cache(resolveRequestLocale);
