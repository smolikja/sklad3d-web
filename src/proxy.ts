import { NextResponse, type NextRequest } from "next/server";

import { isLocale, matchAcceptLanguage, type Locale } from "@/i18n/config";

// In Next.js 16 the former `middleware` file convention is renamed to `proxy`
// (identical signature). This implements the "always-prefix" locale scheme from
// the official Next.js i18n guide: every locale lives under a prefix (`/cs`,
// `/en`) and a request without a prefix is redirected to the visitor's locale.
// No locale is privileged, so changing the default never migrates any URL.
// Metadata files and static assets are excluded via `config.matcher` below and
// never reach here.

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function rememberLocale(response: NextResponse, locale: Locale): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  return matchAcceptLanguage(request.headers.get("accept-language"));
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  // Path already carries a locale prefix → serve it, remember the choice, and
  // expose the locale as a request header so `global-not-found` (which gets no
  // route params) can localize an unmatched path to match its URL prefix.
  if (isLocale(firstSegment)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", firstSegment);
    return rememberLocale(
      NextResponse.next({ request: { headers: requestHeaders } }),
      firstSegment,
    );
  }

  // No prefix (incl. the bare `/`) → redirect to the visitor's locale.
  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return rememberLocale(NextResponse.redirect(url), locale);
}

export const config = {
  // Run only on localizable page routes. Exclude Next internals, API routes,
  // `.well-known`, the OpenGraph image route (at any depth), and paths with a
  // file extension (metadata files + public assets).
  matcher: ["/((?!api|_next|\\.well-known|.*opengraph-image|.*\\.[\\w]+$).*)"],
};
