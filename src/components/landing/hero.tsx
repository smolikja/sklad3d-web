import { DiscordIcon, InstagramIcon } from "@/components/icons/brand-icons";
import { placePhotos } from "@/config/assets";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { ApplyLink } from "./apply-link";
import { containerClassName } from "./section";
import { SubpixelPhoto } from "./subpixel-photo";

const channelLinkClassName =
  "inline-flex min-h-11 items-center gap-2 rounded-md font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Opening: what SKLAD is and the invitation on the left, the studio itself on
 * the right, and the three facts a visitor decides on (where, when, how much)
 * closing the text column.
 */
export function Hero({ copy, place }: { copy: Dictionary["hero"]; place: Dictionary["place"] }) {
  const facts = [
    {
      label: copy.facts.address,
      value: (
        <a
          href={siteConfig.address.mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-foreground/30 underline-offset-4 outline-none hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {place.address}
        </a>
      ),
    },
    { label: copy.facts.access, value: copy.facts.accessValue },
    { label: copy.facts.membership, value: copy.facts.membershipValue },
  ];

  return (
    <section className={`${containerClassName} grid grid-cols-[minmax(0,1fr)] gap-12 pt-10 pb-20 sm:pt-16 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:py-16`}>
      <div className="flex flex-col gap-8">
        <h1 className="text-[2.375rem] leading-[1.04] font-bold tracking-[-0.03em] text-balance font-stretch-[112%] sm:text-[3.25rem] xl:text-[3.75rem]">
          {copy.title}
        </h1>
        <p className="max-w-[58ch] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          {copy.text}
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ApplyLink>{copy.apply}</ApplyLink>
          <ul aria-label={copy.channelsAria} className="flex items-center gap-6">
            <li>
              <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className={channelLinkClassName}>
                <InstagramIcon className="size-5" />
                Instagram
              </a>
            </li>
            <li>
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className={channelLinkClassName}>
                <DiscordIcon className="size-5" />
                Discord
              </a>
            </li>
          </ul>
        </div>
        <dl className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-5 border-t pt-6 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">{fact.label}</dt>
              <dd className="text-base font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <SubpixelPhoto
        image={placePhotos.studio}
        alt={copy.photoAlt}
        sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, calc(100vw - 2.5rem)"
        className="aspect-[4/5] w-full rounded-2xl lg:max-h-[calc(100dvh-8rem)] lg:justify-self-end"
      />
    </section>
  );
}
