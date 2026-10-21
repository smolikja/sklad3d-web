import type { MemberId } from "@/config/members";
import type { BenefitId, NavItemId } from "@/config/site";

export type TitledText = {
  title: string;
  text: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Everything about one member that is written rather than configured. Keys of
 * `links` and `media` mirror the ids in `src/config/members.ts`;
 * `src/i18n/dictionaries.ts` checks at load time that none is missing.
 */
export type MemberCopy = {
  role: string;
  /**
   * Bio paragraphs. Inline markup: `**text**` highlights a project or
   * discipline, `[label](https://…)` is an external link.
   */
  bio: string[];
  /** Link id → visible label. */
  links: Record<string, string>;
  /** Media id → one-line description, used as alt text and lightbox caption. */
  media: Record<string, string>;
};

/**
 * Shape of a translation catalog. Every `messages/<locale>.json` file must
 * satisfy this type (see `messages/validate.ts`), which guarantees that all
 * locales stay in sync — a missing key is a compile error.
 */
export type DictionaryCatalog = {
  meta: {
    title: string;
    description: string;
  };
  og: {
    alt: string;
    title: string;
  };
  manifest: {
    description: string;
  };
  nav: Record<NavItemId, string> & {
    aria: string;
    home: string;
    apply: string;
    menuOpen: string;
    menuClose: string;
    menuTitle: string;
  };
  languageSwitcher: {
    label: string;
    cs: string;
    en: string;
  };
  /** Where and when — shared by the hero, the closing call and the footer. */
  place: {
    address: string;
    hours: string;
    mapLink: string;
  };
  hero: {
    title: string;
    text: string;
    apply: string;
    photoAlt: string;
    channelsAria: string;
    facts: {
      address: string;
      access: string;
      accessValue: string;
      membership: string;
      membershipValue: string;
    };
  };
  about: {
    title: string;
    text: string;
    highlights: TitledText[];
  };
  members: {
    title: string;
    text: string;
    rosterAria: string;
    /** `{name}` and `{nickname}` — how a member with a nickname is introduced. */
    nameWithNickname: string;
    /** Template with `{name}`. */
    linksAria: string;
    gallery: {
      /** Template with `{name}`. */
      label: string;
      /** Template with `{index}` and `{count}`. */
      slide: string;
      previous: string;
      next: string;
      /** Template with `{description}`. */
      open: string;
      video: string;
    };
    lightbox: {
      close: string;
      previous: string;
      next: string;
      /** Template with `{index}` and `{count}`. */
      position: string;
    };
    items: Record<MemberId, MemberCopy>;
  };
  benefits: {
    title: string;
    items: Record<BenefitId, TitledText>;
  };
  community: {
    title: string;
    text: string;
    instagram: TitledText & { action: string };
    discord: TitledText & { action: string };
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  callout: {
    title: string;
    text: string;
    apply: string;
  };
  footer: {
    aria: string;
    navTitle: string;
    communityTitle: string;
    applyTitle: string;
    apply: string;
    /** Template with `{year}`. */
    copyright: string;
    /** Template with `{name}`. */
    credit: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
};

export type Dictionary = DictionaryCatalog;
