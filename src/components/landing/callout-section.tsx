import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { ApplyLink } from "./apply-link";
import { Section } from "./section";

/** The closing invitation: come and see the place, with where and when. */
export function CalloutSection({ copy, place }: { copy: Dictionary["callout"]; place: Dictionary["place"] }) {
  return (
    <Section labelledBy="callout-title">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 rounded-3xl border bg-card p-7 sm:p-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16 lg:p-16">
        <div className="flex flex-col gap-6">
          <h2 id="callout-title" className="font-display text-[2.5rem] text-balance sm:text-6xl lg:text-7xl">
            {copy.title}
          </h2>
          <p className="max-w-[48ch] text-lg leading-relaxed text-pretty text-muted-foreground">{copy.text}</p>
          <ApplyLink className="self-start">{copy.apply}</ApplyLink>
        </div>
        <address className="flex flex-col gap-1 border-t pt-6 text-lg not-italic lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <span className="font-medium">{place.address}</span>
          <span className="text-muted-foreground">{place.hours}</span>
          <a
            href={siteConfig.address.mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center self-start rounded-sm font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {place.mapLink}
          </a>
        </address>
      </div>
    </Section>
  );
}
