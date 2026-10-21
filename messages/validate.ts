import type { DictionaryCatalog } from "@/i18n/dictionary";

import cs from "./cs.json";
import en from "./en.json";

/**
 * Compile-time guarantee that every message catalog is complete and structurally
 * in sync with `Dictionary`. A missing or misspelled key makes `tsc` fail here,
 * so translations can never silently drift as new locales are added.
 *
 * This module is intentionally not imported at runtime — it exists purely for
 * type checking.
 */
export const catalogs: DictionaryCatalog[] = [cs, en];
