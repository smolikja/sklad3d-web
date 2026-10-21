import { getRedirectUrl, unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "./proxy";

const ORIGIN = "https://sklad3d.cz";

describe("proxy matcher", () => {
  it.each(["/", "/cs", "/en", "/unknown", "/cs/unknown"])(
    "matches page route %s",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(true);
    },
  );

  it.each([
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/icon.png",
    "/brand/logo.svg",
    "/images/members/oxoo/avatar.jpg",
    "/cs/opengraph-image/og",
    "/_next/static/chunk.js",
    "/api/anything",
    "/.well-known/security.txt",
  ])("skips metadata, asset and internal path %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(false);
  });
});

describe("unprefixed requests", () => {
  it("redirects the bare / to the Accept-Language locale", () => {
    const response = proxy(
      new NextRequest(`${ORIGIN}/`, { headers: { "accept-language": "en-GB,en;q=0.9" } }),
    );

    expect(response.status).toBe(307);
    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/en`);
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("en");
  });

  it("prefers a valid NEXT_LOCALE cookie over the header", () => {
    const response = proxy(
      new NextRequest(`${ORIGIN}/`, {
        headers: { "accept-language": "en", cookie: "NEXT_LOCALE=cs" },
      }),
    );

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/cs`);
  });

  it("falls back to the default locale and keeps the path", () => {
    const response = proxy(
      new NextRequest(`${ORIGIN}/foo?bar=1`, { headers: { "accept-language": "de" } }),
    );

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/cs/foo?bar=1`);
  });

});

describe("prefixed requests", () => {
  it("passes through, remembers the locale and forwards it as x-locale", () => {
    const response = proxy(new NextRequest(`${ORIGIN}/en`, { headers: { cookie: "NEXT_LOCALE=cs" } }));

    expect(response.status).toBe(200);
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("en");
    expect(response.headers.get("x-middleware-request-x-locale")).toBe("en");
  });
});
