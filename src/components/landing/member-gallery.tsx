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
 * ratio so nothing is cropped. The row responds to drag, touch, trackpad and
 * arrow keys; a piece opens full screen in the lightbox. Videos preview
 * silently while visible (see `ShowcaseVideo`).
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
  const slideButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const closeLightbox = () => {
    // Leave the row on the piece that was last viewed.
    if (openIndex !== null) api?.scrollTo(openIndex);
    setOpenIndex(null);
  };

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", containScroll: "trimSnaps", dragFree: true }}
        plugins={[WheelGesturesPlugin()]}
        aria-label={label}
        className="flex flex-col gap-5"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {media.map((item, index) => {
            const { width, height } = mediaSize(item);
            const description = descriptions[item.id];
            return (
              <CarouselItem
                key={item.id}
                aria-label={format(copy.slide, { index: index + 1, count: media.length })}
                className="basis-auto pl-3 sm:pl-4"
              >
                <button
                  ref={(element) => {
                    slideButtons.current[index] = element;
                  }}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={format(copy.open, { description })}
                  style={{ aspectRatio: `${width} / ${height}` }}
                  className="group relative block h-72 max-w-[85vw] cursor-zoom-in overflow-hidden rounded-xl bg-card outline-none focus-visible:ring-3 focus-visible:ring-ring sm:h-96 lg:h-[28rem]"
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
    </>
  );
}

/**
 * Previous/next buttons and a progress line under the row. Hidden when the
 * whole row fits on screen and there is nothing to scroll.
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
    <div className="flex items-center gap-4 pr-5 sm:pr-8">
      <CarouselPrevious aria-label={copy.previous} size="icon-lg" className="static size-11 translate-y-0 rounded-lg" />
      <CarouselNext aria-label={copy.next} size="icon-lg" className="static size-11 translate-y-0 rounded-lg" />
      <div aria-hidden="true" className="relative ml-2 h-px max-w-xs flex-1 bg-border">
        <div
          className="absolute inset-y-0 left-0 w-full origin-left bg-foreground"
          style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }}
        />
      </div>
    </div>
  );
}
