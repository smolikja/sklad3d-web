import { SkladLogo } from "@/components/icons/sklad-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { mainNav, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/format";
import { ApplyLink } from "./apply-link";
import { containerClassName } from "./section";

const linkClassName =
  "inline-flex min-h-11 items-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

const titleClassName = "text-sm font-semibold text-foreground";

export function SiteFooter({
  locale,
  copy,
  navCopy,
  place,
  languageCopy,
}: {
  locale: Locale;
  copy: Dictionary["footer"];
  navCopy: Dictionary["nav"];
  place: Dictionary["place"];
  languageCopy: Dictionary["languageSwitcher"];
}) {
  // The credit template wraps the studio's name, which becomes a link.
  const [creditBefore, creditAfter = ""] = copy.credit.split("{name}");

  return (
    <footer aria-label={copy.aria} className="border-t">
      <div className={`${containerClassName} flex flex-col gap-12 py-14`}>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,4fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <SkladLogo className="h-[1.125rem]" />
              <span className="font-display text-xl">{siteConfig.name}</span>
            </div>
            <address className="flex flex-col not-italic">
              <a href={siteConfig.address.mapHref} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                {place.address}
              </a>
              <span className="text-muted-foreground">{place.hours}</span>
            </address>
          </div>
          <nav aria-label={copy.navTitle} className="flex flex-col gap-2">
            <h2 className={titleClassName}>{copy.navTitle}</h2>
            <ul>
              {mainNav.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className={linkClassName}>
                    {navCopy[item.id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-2">
            <h2 className={titleClassName}>{copy.communityTitle}</h2>
            <ul>
              <li>
                <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                  Instagram
                </a>
              </li>
              <li>
                <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                  Discord
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4">
            <h2 className={titleClassName}>{copy.applyTitle}</h2>
            <ApplyLink variant="outline">{copy.apply}</ApplyLink>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t pt-6 text-sm text-muted-foreground">
          <p>
            {format(copy.copyright, { year: new Date().getFullYear() })} {creditBefore}
            <a href={siteConfig.credit.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {siteConfig.credit.name}
            </a>
            {creditAfter}
          </p>
          <LanguageSwitcher locale={locale} copy={languageCopy} />
        </div>
      </div>
    </footer>
  );
}
