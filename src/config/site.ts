/**
 * Locale-independent site configuration. All user-facing copy lives in
 * `messages/*.json`; this file only holds structural data (brand, URLs, nav
 * targets, external links, the address) that is the same in every language.
 */
export const siteConfig = {
  name: "SKLAD",
  url: "https://sklad.digital",
  /** Every "apply" action leads to this form — it is also the tour booking. */
  applyHref: "https://forms.gle/EsspyQexMK8yMAE37",
  links: {
    instagram: "https://www.instagram.com/sklad.3d/",
    discord: "https://discord.gg/rQtbRrkQFC",
  },
  address: {
    streetAddress: "Drtinova 557/10",
    postalCode: "150 00",
    addressLocality: "Praha 5",
    addressCountry: "CZ",
    latitude: 50.0765434,
    longitude: 14.4022776,
    mapHref:
      "https://www.google.com/maps/place/Drtinova+557%2F10,+150+00+Praha+5-Sm%C3%ADchov/@50.0765434,14.4022776,17z",
  },
  /** Monthly membership, used in structured data; the page shows `hero.facts`. */
  membership: { price: 5000, currency: "CZK" },
  /** Matches `--background`; browser chrome blends with the page. */
  themeColor: "#000000",
  credit: { name: "smolikja team", href: "https://smolikja.team/" },
} as const;

/**
 * Primary navigation. `id` keys into `dict.nav[id]` for the label and is the
 * section's anchor, identical across locales.
 */
export const mainNav = [
  { id: "about", href: "#about" },
  { id: "members", href: "#members" },
  { id: "benefits", href: "#benefits" },
  { id: "community", href: "#community" },
  { id: "faq", href: "#faq" },
] as const;

export type NavItemId = (typeof mainNav)[number]["id"];

/** What membership includes, in display order; copy is `dict.benefits.items[id]`. */
export const benefitIds = ["community", "space", "trial", "flow", "location"] as const;

export type BenefitId = (typeof benefitIds)[number];
