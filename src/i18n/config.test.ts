import { describe, expect, it } from "vitest";

import {
  canonicalLanguageTag,
  localizedPathname,
  matchAcceptLanguage,
  splitLocale,
} from "./config";

describe("matchAcceptLanguage", () => {
  it("returns the default for empty or unsupported input", () => {
    expect(matchAcceptLanguage(null)).toBe("cs");
    expect(matchAcceptLanguage("")).toBe("cs");
    expect(matchAcceptLanguage("de-DE,de;q=0.9")).toBe("cs");
  });

  it("matches the primary subtag of a regional tag", () => {
    expect(matchAcceptLanguage("en-AU")).toBe("en");
    expect(matchAcceptLanguage("cs-CZ")).toBe("cs");
  });

  it("ranks by quality, then by order", () => {
    expect(matchAcceptLanguage("cs;q=0.5,en;q=0.8")).toBe("en");
    expect(matchAcceptLanguage("en,cs")).toBe("en");
    expect(matchAcceptLanguage("de,cs,en")).toBe("cs");
  });

  it("treats q=0 as not acceptable and skips malformed entries", () => {
    expect(matchAcceptLanguage("en;q=0,cs")).toBe("cs");
    expect(matchAcceptLanguage("en;q=abc,cs")).toBe("cs");
    expect(matchAcceptLanguage("!!!,en")).toBe("en");
  });

  it("caps the number of parsed entries", () => {
    const header = `${Array.from({ length: 25 }, () => "de").join(",")},en`;
    expect(matchAcceptLanguage(header)).toBe("cs");
  });
});

describe("canonicalLanguageTag", () => {
  it("canonicalizes case and rejects garbage", () => {
    expect(canonicalLanguageTag("EN-us")).toBe("en-US");
    expect(canonicalLanguageTag("")).toBeNull();
    expect(canonicalLanguageTag("x".repeat(300))).toBeNull();
    expect(canonicalLanguageTag("not a tag")).toBeNull();
  });
});

describe("paths", () => {
  it("builds and splits prefixed pathnames", () => {
    expect(localizedPathname("cs")).toBe("/cs");
    expect(localizedPathname("en", "/foo")).toBe("/en/foo");
    expect(splitLocale("/en/foo")).toEqual({ locale: "en", pathname: "/foo" });
    expect(splitLocale("/en/foo/")).toEqual({ locale: "en", pathname: "/foo" });
    expect(splitLocale("/foo")).toEqual({ locale: "cs", pathname: "/foo" });
  });
});
