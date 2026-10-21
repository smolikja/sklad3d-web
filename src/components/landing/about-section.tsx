import type { Dictionary } from "@/i18n/dictionary";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

/** How membership works: the idea of the collective and its three ground rules. */
export function AboutSection({ copy }: { copy: Dictionary["about"] }) {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeading id="about-title" title={copy.title} text={copy.text} />
      <ul className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 md:grid-cols-3">
        {copy.highlights.map((item) => (
          <li key={item.title} className="flex flex-col gap-3 border-t border-foreground/25 pt-6">
            <h3 className="text-xl font-bold tracking-tight font-stretch-[112%]">{item.title}</h3>
            <p className="leading-relaxed text-pretty text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
