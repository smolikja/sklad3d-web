import { DiscordIcon, InstagramIcon } from "@/components/icons/brand-icons";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

/** Where the community lives online, as two large destinations. */
export function CommunitySection({ copy }: { copy: Dictionary["community"] }) {
  const channels = [
    { id: "instagram", href: siteConfig.links.instagram, Icon: InstagramIcon, ...copy.instagram },
    { id: "discord", href: siteConfig.links.discord, Icon: DiscordIcon, ...copy.discord },
  ];

  return (
    <Section id="community" labelledBy="community-title">
      <SectionHeading id="community-title" title={copy.title} text={copy.text} />
      <ul className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
        {channels.map(({ id, href, Icon, title, text, action }) => (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-7 transition-colors outline-none hover:border-primary/60 focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-10"
            >
              <Icon className="size-8" />
              <h3 className="text-2xl font-bold tracking-tight font-stretch-[112%] sm:text-3xl">{title}</h3>
              <p className="max-w-[44ch] leading-relaxed text-pretty text-muted-foreground">{text}</p>
              <span className="mt-auto pt-4 font-semibold text-primary underline-offset-4 group-hover:underline">
                {action}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
