import { LampDeskIcon, MapPinIcon, SparklesIcon, TimerIcon, UsersIcon, type LucideIcon } from "lucide-react";

import { benefitIds, type BenefitId } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

const benefitIcons: Record<BenefitId, LucideIcon> = {
  community: UsersIcon,
  space: LampDeskIcon,
  trial: TimerIcon,
  flow: SparklesIcon,
  location: MapPinIcon,
};

/** What a member gets, as a spec sheet: one row per benefit. */
export function BenefitsSection({ copy }: { copy: Dictionary["benefits"] }) {
  return (
    <Section id="benefits" labelledBy="benefits-title">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHeading id="benefits-title" title={copy.title} className="lg:sticky lg:top-28 lg:self-start" />
        <dl className="divide-y border-y">
          {benefitIds.map((id) => {
            const Icon = benefitIcons[id];
            const item = copy.items[id];
            return (
              <div key={id} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 py-7 sm:grid-cols-[2.5rem_10rem_minmax(0,1fr)] sm:gap-x-6">
                <Icon aria-hidden="true" className="size-6 text-primary sm:mt-0.5" />
                <dt className="text-xl font-bold tracking-tight font-stretch-[112%]">{item.title}</dt>
                <dd className="col-start-2 leading-relaxed text-pretty text-muted-foreground sm:col-start-3 sm:row-start-1">
                  {item.text}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
