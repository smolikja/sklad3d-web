import Image from "next/image";

import { memberAnchor, members } from "@/config/members";
import type { Dictionary } from "@/i18n/dictionary";
import { MemberProfile } from "./member-profile";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

/**
 * Who is in SKLAD and what they make — the heart of the page. A roster of
 * faces jumps to each member; every member then gets a full-width band.
 */
export function MembersSection({ copy }: { copy: Dictionary["members"] }) {
  return (
    <Section id="members" labelledBy="members-title" className="overflow-x-clip pb-0 sm:pb-0">
      <SectionHeading id="members-title" title={copy.title} text={copy.text} />

      <nav aria-label={copy.rosterAria} className="mt-10 -mr-5 sm:mr-0">
        <ul className="flex gap-2 overflow-x-auto pr-5 pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pr-0">
          {members.map((member) => (
            <li key={member.id} className="shrink-0">
              <a
                href={`#${memberAnchor(member)}`}
                className="flex min-h-11 items-center gap-3 rounded-lg border py-1 pr-4 pl-1 font-medium transition-colors outline-none hover:border-primary/60 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Image
                  src={member.avatar.src}
                  alt=""
                  width={member.avatar.width}
                  height={member.avatar.height}
                  sizes="36px"
                  className="size-9 rounded-md bg-card object-cover"
                />
                {member.nickname ?? member.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-14 sm:mt-20">
        {members.map((member) => (
          <MemberProfile
            key={member.id}
            member={member}
            copy={copy.items[member.id]}
            shared={copy}
          />
        ))}
      </div>
    </Section>
  );
}
