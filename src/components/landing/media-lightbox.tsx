"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import type { MemberMedia } from "@/config/members";
import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/format";
import { posterUrl } from "./media";

const stepButtonClassName = "size-11 rounded-lg";

/**
 * Full-screen view of one gallery item: the image at full resolution or the
 * video with sound and controls, its description, and stepping through the
 * member's work with the buttons or the arrow keys. Escape, the close button
 * and a click on the backdrop close it (Base UI dialog).
 */
export function MediaLightbox({
  media,
  descriptions,
  index,
  onIndexChange,
  onClose,
  returnFocus,
  copy,
}: {
  media: readonly MemberMedia[];
  descriptions: Record<string, string>;
  /** The open item, or `null` when the lightbox is closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** The element to focus on close — the slide of the item viewed last. */
  returnFocus: (index: number) => HTMLElement | null;
  copy: Dictionary["members"]["lightbox"];
}) {
  // Keep showing the last item while the dialog animates out.
  const [shown, setShown] = useState(index ?? 0);
  if (index !== null && index !== shown) setShown(index);

  const count = media.length;
  const item = media[shown];
  const description = descriptions[item.id];
  const step = (delta: number) => onIndexChange((shown + delta + count) % count);

  const stepButtons = (className: string) =>
    count > 1 ? (
      <div className={className}>
        <Button variant="outline" size="icon-lg" className={stepButtonClassName} aria-label={copy.previous} onClick={() => step(-1)}>
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="icon-lg" className={stepButtonClassName} aria-label={copy.next} onClick={() => step(1)}>
          <ChevronRightIcon />
        </Button>
      </div>
    ) : null;

  return (
    <Dialog open={index !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/92 supports-backdrop-filter:backdrop-blur-sm" />
        <DialogPrimitive.Popup
          finalFocus={() => returnFocus(shown)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") step(-1);
            else if (event.key === "ArrowRight") step(1);
          }}
          className="fixed inset-0 z-50 flex flex-col outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <p className="text-sm text-muted-foreground tabular-nums">
              {format(copy.position, { index: shown + 1, count })}
            </p>
            <DialogClose
              render={<Button variant="ghost" size="icon-lg" className={stepButtonClassName} />}
              aria-label={copy.close}
            >
              <XIcon />
            </DialogClose>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            {item.kind === "image" ? (
              <Image
                key={item.id}
                src={item.src}
                alt={description}
                width={item.width}
                height={item.height}
                sizes="100vw"
                className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
              />
            ) : (
              <video
                key={item.id}
                src={item.src}
                poster={posterUrl(item.poster, 1920)}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-full max-w-full rounded-lg bg-black"
              />
            )}
            {stepButtons(
              "pointer-events-none absolute inset-x-4 top-1/2 hidden -translate-y-1/2 justify-between *:pointer-events-auto sm:flex",
            )}
          </div>

          <div className="flex shrink-0 items-center gap-4 px-4 py-4 sm:px-6 sm:py-6">
            <DialogTitle className="flex-1 text-base leading-snug font-normal text-pretty">
              {description}
            </DialogTitle>
            {stepButtons("flex gap-2 sm:hidden")}
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
