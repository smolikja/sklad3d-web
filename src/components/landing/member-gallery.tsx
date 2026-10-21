"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { PlayIcon } from "lucide-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { MemberMedia } from "@/config/members";
import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/format";
import { MediaLightbox } from "./media-lightbox";
import { mediaSize, posterUrl, slideSizes, slideWidth } from "./media";
import { ShowcaseVideo } from "./showcase-video";

type GalleryCopy = Dictionary["members"]["gallery"];

/**
 * A member's work as one row at a fixed height, each piece at its own aspect
 * ratio so nothing is cropped. A piece opens full screen in the lightbox;
 * videos preview silently while visible (see `ShowcaseVideo`).
 *
 * The row is full-bleed: it scrolls under both edges of the window instead of
 * being cut off at the content column, while its first and last piece — and
 * every piece it comes to rest on — line up with the column's edge
 * (`--page-inset`). Embla measures the start inset from the track's padding
 * and the end inset from the last slide's margin, so the two are set that way.
 */
export function MemberGallery({
  media,
  descriptions,
  label,
  copy,
  lightboxCopy,
}: {
  media: readonly MemberMedia[];
  descriptions: Record<string, string>;
  label: string;
  copy: GalleryCopy;
  lightboxCopy: Dictionary["members"]["lightbox"];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [plugins] = useState(() => [WheelGesturesPlugin()]);
  const track = useRef<HTMLDivElement>(null);
  const slideButtons = useRef<(HTMLButtonElement | null)[]>([]);

  // Pieces come to rest on the content column's edge, not the window's.
  // Read on every (re)init, so it follows the inset across breakpoints.
  const align = useCallback(() => {
    const node = track.current;
    return node ? parseFloat(getComputedStyle(node).paddingInlineStart) || 0 : 0;
  }, []);

  const closeLightbox = () => {
    // Leave the row on the piece that was viewed last. Near the end several
    // pieces share one resting position, so map the piece to its snap.
    if (openIndex !== null && api) {
      const snap = api.internalEngine().slideRegistry.findIndex((group) => group.includes(openIndex));
      if (snap >= 0) api.scrollTo(snap);
    }
    setOpenIndex(null);
  };

  return (
    <div className="mx-[calc(-1*var(--page-inset))]">
      <Carousel
        setApi={setApi}
        opts={{ align, containScroll: "trimSnaps", skipSnaps: true }}
        plugins={plugins}
        aria-label={label}
        className="flex flex-col gap-4"
      >
        {/* Vertical padding keeps the focus ring clear of the viewport's clipping. */}
        <CarouselContent ref={track} className="ml-0 gap-3 py-1.5 ps-(--page-inset) sm:gap-4">
          {media.map((item, index) => {
            const { width, height } = mediaSize(item);
            const description = descriptions[item.id];
            return (
              <CarouselItem
                key={item.id}
                aria-label={format(copy.slide, { index: index + 1, count: media.length })}
                className="basis-auto pl-0 last:me-(--page-inset)"
              >
                <button
                  ref={(element) => {
                    slideButtons.current[index] = element;
                  }}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={format(copy.open, { description })}
                  style={{ aspectRatio: `${width} / ${height}` }}
                  className="relative block h-72 max-w-[calc(100vw-2*var(--page-inset))] cursor-zoom-in overflow-hidden rounded-xl bg-card outline-none focus-visible:ring-3 focus-visible:ring-ring sm:h-96 lg:h-[28rem]"
                >
                  {item.kind === "image" ? (
                    <Image
                      src={item.src}
                      alt=""
                      width={item.width}
                      height={item.height}
                      sizes={slideSizes(item)}
                      className="size-full object-contain"
                    />
                  ) : (
                    <>
                      <ShowcaseVideo
                        src={item.src}
                        poster={posterUrl(item.poster, slideWidth(item))}
                        paused={openIndex !== null}
                        className="size-full bg-black object-contain"
                      />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-xs font-medium">
                        <PlayIcon aria-hidden="true" className="size-3 fill-current" />
                        {copy.video}
                      </span>
                    </>
                  )}
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <GalleryControls copy={copy} />
      </Carousel>
      <MediaLightbox
        media={media}
        descriptions={descriptions}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={closeLightbox}
        returnFocus={(index) => slideButtons.current[index] ?? null}
        copy={lightboxCopy}
      />
    </div>
  );
}

/**
 * A progress line and previous/next buttons under the row, on the content
 * column. Hidden when the whole row fits on screen and there is nothing to
 * scroll; swiping is never the only way through the work.
 */
function GalleryControls({ copy }: { copy: GalleryCopy }) {
  const { api, canScrollPrev, canScrollNext } = useCarousel();

  // Scroll progress lives in Embla; subscribe to it as an external store.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!api) return () => {};
      api.on("scroll", onChange);
      api.on("reInit", onChange);
      return () => {
        api.off("scroll", onChange);
        api.off("reInit", onChange);
      };
    },
    [api],
  );
  const progress = useSyncExternalStore(
    subscribe,
    () => Math.min(1, Math.max(0, api?.scrollProgress() ?? 0)),
    () => 0,
  );

  if (!canScrollPrev && !canScrollNext) return null;

  return (
    <div className="flex items-center gap-6 px-(--page-inset)">
      <div aria-hidden="true" className="relative h-px max-w-xs flex-1 bg-border">
        <div
          className="absolute inset-y-0 left-0 w-full origin-left bg-foreground"
          style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }}
        />
      </div>
      <div className="ml-auto flex gap-2">
        <CarouselPrevious aria-label={copy.previous} size="icon-lg" className="static size-11 translate-y-0 rounded-lg" />
        <CarouselNext aria-label={copy.next} size="icon-lg" className="static size-11 translate-y-0 rounded-lg" />
      </div>
    </div>
  );
}
