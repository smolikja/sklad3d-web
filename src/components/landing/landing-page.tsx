import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { localizedPathname, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { AboutSection } from "./about-section";
import { BenefitsSection } from "./benefits-section";
import { CalloutSection } from "./callout-section";
import { CommunitySection } from "./community-section";
import { FaqSection } from "./faq-section";
import { Hero } from "./hero";
import { MembersSection } from "./members-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * Composes the landing page in the original reading order: what SKLAD is →
 * how it works → who is in it → what membership gives → where the community
 * lives → questions → come for a tour. Each section receives only the
 * dictionary subtree it renders.
 */
export function LandingPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <>
      <SiteHeader
        homeHref={localizedPathname(locale)}
        copy={dict.nav}
        languageSwitcher={<LanguageSwitcher locale={locale} copy={dict.languageSwitcher} />}
        mobileLanguageSwitcher={<LanguageSwitcher locale={locale} copy={dict.languageSwitcher} />}
      />
      <main className="flex flex-1 flex-col">
        <Hero copy={dict.hero} place={dict.place} />
        <AboutSection copy={dict.about} />
        <MembersSection copy={dict.members} />
        <BenefitsSection copy={dict.benefits} />
        <CommunitySection copy={dict.community} />
        <FaqSection copy={dict.faq} />
        <CalloutSection copy={dict.callout} place={dict.place} />
      </main>
      <SiteFooter
        locale={locale}
        copy={dict.footer}
        navCopy={dict.nav}
        place={dict.place}
        languageCopy={dict.languageSwitcher}
      />
    </>
  );
}
