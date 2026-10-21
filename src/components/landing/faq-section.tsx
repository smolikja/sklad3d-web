import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Dictionary } from "@/i18n/dictionary";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

/** The questions that would otherwise stop a visitor from applying. */
export function FaqSection({ copy }: { copy: Dictionary["faq"] }) {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHeading id="faq-title" title={copy.title} className="lg:sticky lg:top-28 lg:self-start" />
        <Accordion className="border-y">
          {copy.items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="min-h-14 items-center py-4 text-base font-semibold hover:no-underline sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-pretty text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
