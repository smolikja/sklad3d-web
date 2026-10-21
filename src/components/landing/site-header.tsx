import { SkladLogo } from "@/components/icons/sklad-logo";
import { mainNav, siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { ApplyLink } from "./apply-link";
import { MobileMenu } from "./mobile-menu";
import { containerClassName } from "./section";

/**
 * Sticky header: the RGB mark with the name, the five sections, the language
 * switch and the application. Below `lg` the sections and the language move
 * into the sheet menu; the application stays visible from `sm`.
 */
export function SiteHeader({
  homeHref,
  copy,
  languageSwitcher,
  mobileLanguageSwitcher,
}: {
  homeHref: string;
  copy: Dictionary["nav"];
  languageSwitcher: React.ReactNode;
  mobileLanguageSwitcher: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className={`${containerClassName} flex h-16 items-center gap-4`}>
        <a
          href={homeHref}
          aria-label={copy.home}
          className="flex min-h-11 items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <SkladLogo className="h-[1.125rem]" />
          <span aria-hidden="true" className="font-display text-xl">
            {siteConfig.name}
          </span>
        </a>
        <nav aria-label={copy.aria} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="inline-flex h-11 items-center rounded-md px-3 text-[0.9375rem] font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {copy[item.id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
          <div className="hidden lg:block">{languageSwitcher}</div>
          <ApplyLink className="hidden h-11 px-4 text-[0.9375rem] sm:inline-flex">{copy.apply}</ApplyLink>
          <div className="lg:hidden">
            <MobileMenu copy={copy}>{mobileLanguageSwitcher}</MobileMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
