import { members } from "@/config/members";

import type { Locale } from "./config";
import type { Dictionary, DictionaryCatalog } from "./dictionary";

/**
 * Runtime cross-check between structural data and copy: every member, link
 * and media item declared in `src/config/members.ts` must have its copy in the
 * catalog. The type system guarantees that every member id has an entry; the
 * link and media keys are plain strings, so they are checked here.
 */
function normalizeDictionary(catalog: DictionaryCatalog): Dictionary {
  for (const member of members) {
    const copy = catalog.members.items[member.id];
    if (!copy) throw new Error(`Missing copy for member "${member.id}".`);
    for (const link of member.links) {
      if (!copy.links[link.id]) {
        throw new Error(`Missing link label for "${member.id}/${link.id}".`);
      }
    }
    for (const item of member.media) {
      if (!copy.media[item.id]) {
        throw new Error(`Missing media description for "${member.id}/${item.id}".`);
      }
    }
  }

  return catalog;
}

/**
 * Lazily loads a translation catalog for the given locale. Catalogs are plain
 * JSON so they can later be handed to a translation-management system; the cast
 * is validated at compile time by `messages/validate.ts`.
 *
 * Because this only runs in Server Components, the JSON never reaches the client
 * bundle — only the rendered HTML does.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  cs: () =>
    import("../../messages/cs.json").then((m) =>
      normalizeDictionary(m.default as DictionaryCatalog),
    ),
  en: () =>
    import("../../messages/en.json").then((m) =>
      normalizeDictionary(m.default as DictionaryCatalog),
    ),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
