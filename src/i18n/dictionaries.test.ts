import { describe, expect, it } from "vitest";

import { members } from "@/config/members";
import { benefitIds } from "@/config/site";
import { defaultLocale, locales } from "./config";
import { getDictionary } from "./dictionaries";
import { format } from "./format";

describe("getDictionary", () => {
  it.each(locales)("loads a catalog for %s that covers every member, link and media item", async (locale) => {
    const dict = await getDictionary(locale);

    for (const member of members) {
      const copy = dict.members.items[member.id];
      expect(copy.role).toBeTruthy();
      for (const link of member.links) expect(copy.links[link.id]).toBeTruthy();
      for (const item of member.media) expect(copy.media[item.id]).toBeTruthy();
    }
    for (const id of benefitIds) expect(dict.benefits.items[id].title).toBeTruthy();
  });

  it.each(locales)("fills every template placeholder in %s", async (locale) => {
    const dict = await getDictionary(locale);
    const rendered = [
      format(dict.members.nameWithNickname, { name: "A", nickname: "B" }),
      format(dict.members.linksAria, { name: "A" }),
      format(dict.members.gallery.label, { name: "A" }),
      format(dict.members.gallery.slide, { index: 1, count: 2 }),
      format(dict.members.gallery.open, { description: "A" }),
      format(dict.members.lightbox.position, { index: 1, count: 2 }),
      format(dict.footer.copyright, { year: 2026 }),
      format(dict.footer.credit, { name: "A" }),
    ];

    for (const text of rendered) expect(text).not.toMatch(/[{}]/);
  });

  it.each(locales.filter((locale) => locale !== defaultLocale))(
    "keeps %s list lengths in step with the source catalog",
    async (locale) => {
      const [source, translation] = await Promise.all([
        getDictionary(defaultLocale),
        getDictionary(locale),
      ]);
      const lengths = (dict: typeof source) => ({
        highlights: dict.about.highlights.length,
        faq: dict.faq.items.length,
        bios: members.map((member) => dict.members.items[member.id].bio.length),
        links: members.map((member) => Object.keys(dict.members.items[member.id].links).length),
        media: members.map((member) => Object.keys(dict.members.items[member.id].media).length),
      });

      expect(lengths(translation)).toEqual(lengths(source));
    },
  );
});
