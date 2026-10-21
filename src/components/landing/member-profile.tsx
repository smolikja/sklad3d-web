import Image from "next/image";

import { memberAnchor, type Member } from "@/config/members";
import type { Dictionary, MemberCopy } from "@/i18n/dictionary";
import { format } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { MemberGallery } from "./member-gallery";
import { RichText } from "./rich-text";

/**
 * One member: portrait, name, role and links, the bio beside them, and their
 * work in a gallery that runs past the content column to the viewport edge.
 */
export function MemberProfile({
  member,
  copy,
  shared,
}: {
  member: Member;
  copy: MemberCopy;
  shared: Pick<Dictionary["members"], "nameWithNickname" | "linksAria" | "gallery" | "lightbox">;
}) {
  const anchor = memberAnchor(member);
  const displayName = member.nickname
    ? format(shared.nameWithNickname, { name: member.name, nickname: member.nickname })
    : member.name;
  const hasBio = copy.bio.length > 0;

  return (
    <article id={anchor} aria-labelledby={`${anchor}-name`} className="scroll-mt-16 border-t py-14 sm:py-20">
      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)] gap-8",
          hasBio && "lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16",
        )}
      >
        <header className={cn("flex items-start gap-5 sm:gap-6", hasBio && "lg:flex-col")}>
          <Image
            src={member.avatar.src}
            alt=""
            width={member.avatar.width}
            height={member.avatar.height}
            sizes="(min-width: 1024px) 160px, (min-width: 640px) 128px, 96px"
            className="size-24 shrink-0 rounded-xl bg-card object-cover sm:size-32 lg:size-40"
          />
          <div className="flex min-w-0 flex-col gap-2">
            <h3 id={`${anchor}-name`} className="text-2xl leading-tight font-bold tracking-tight text-balance font-stretch-[112%] sm:text-3xl">
              {displayName}
            </h3>
            <p className="text-pretty text-muted-foreground">{copy.role}</p>
            <ul aria-label={format(shared.linksAria, { name: member.name })} className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
              {member.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {copy.links[link.id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {hasBio ? (
          <div className="flex max-w-[65ch] flex-col gap-4 text-lg leading-relaxed text-pretty">
            {copy.bio.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        ) : null}
      </div>

      {member.media.length > 0 ? (
        <div className="mt-10 -mr-5 sm:mt-12 sm:mr-[calc(-1*max(2rem,(100vw-80rem)/2+2rem))]">
          <MemberGallery
            media={member.media}
            descriptions={copy.media}
            label={format(shared.gallery.label, { name: member.name })}
            copy={shared.gallery}
            lightboxCopy={shared.lightbox}
          />
        </div>
      ) : null}
    </article>
  );
}
