import { describe, expect, it } from "vitest";

import { parseInline, stripInline } from "./inline-markup";

describe("parseInline", () => {
  it("returns plain text as a single token", () => {
    expect(parseInline("Junior digital artist")).toEqual([
      { type: "text", text: "Junior digital artist" },
    ]);
  });

  it("splits highlights and links in reading order", () => {
    expect(parseInline("Hra **Plantáž** a [web](https://example.com/a)."))
      .toEqual([
        { type: "text", text: "Hra " },
        { type: "highlight", text: "Plantáž" },
        { type: "text", text: " a " },
        { type: "link", text: "web", href: "https://example.com/a" },
        { type: "text", text: "." },
      ]);
  });

  it("keeps unmatched markers and non-http links as literal text", () => {
    expect(parseInline("**open and [x](javascript:alert(1))")).toEqual([
      { type: "text", text: "**open and [x](javascript:alert(1))" },
    ]);
  });
});

describe("stripInline", () => {
  it("removes the markup and keeps the words", () => {
    expect(stripInline("**VR** a [notysky.cz](https://notysky.cz/)")).toBe("VR a notysky.cz");
  });
});
