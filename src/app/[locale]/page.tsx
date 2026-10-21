import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPage } from "@/components/landing/landing-page";
import { brandAssets, placePhotos } from "@/config/assets";
import { memberAnchor, members } from "@/config/members";
import { siteConfig } from "@/config/site";
import { isLocale, localeMeta, locales, localizedPathname } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { jsonLdScript, languageAlternates } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const canonical = localizedPathname(locale);

  return {
    alternates: {
      canonical,
      languages: languageAlternates(),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: canonical,
      siteName: siteConfig.name,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const pageUrl = absolute(localizedPathname(locale));
  const { address, membership } = siteConfig;

  // Structured data: the studio as a local business open around the clock,
  // its membership offer and the people in it, plus the FAQ the page shows —
  // all localized like the page itself.
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#sklad`,
    name: siteConfig.name,
    description: dict.meta.description,
    url: pageUrl,
    inLanguage: localeMeta[locale].hrefLang,
    image: absolute(placePhotos.studio.src),
    logo: absolute(brandAssets.icons.pwa512.src),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      postalCode: address.postalCode,
      addressLocality: address.addressLocality,
      addressCountry: address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.latitude,
      longitude: address.longitude,
    },
    hasMap: address.mapHref,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [siteConfig.links.instagram, siteConfig.links.discord],
    makesOffer: {
      "@type": "Offer",
      name: dict.hero.facts.membership,
      url: siteConfig.applyHref,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: membership.price,
        priceCurrency: membership.currency,
        unitCode: "MON",
      },
    },
    member: members.map((member) => ({
      "@type": "Person",
      name: member.name,
      ...(member.nickname ? { alternateName: member.nickname } : {}),
      jobTitle: dict.members.items[member.id].role,
      image: absolute(member.avatar.src),
      url: `${pageUrl}#${memberAnchor(member)}`,
      sameAs: member.links.map((link) => link.href),
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: localeMeta[locale].hrefLang,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />
      <LandingPage dict={dict} locale={locale} />
    </>
  );
}
