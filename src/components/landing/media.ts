import { getImageProps } from "next/image";

import type { ImageAsset, MemberMedia } from "@/config/members";

/**
 * Gallery row height per breakpoint, in CSS px — mirrors the `h-72 sm:h-96
 * lg:h-[28rem]` classes of a gallery slide. Slide widths follow from each
 * item's own aspect ratio, so nothing is cropped.
 */
const ROW_HEIGHT = { base: 288, sm: 384, lg: 448 } as const;

/** Width and height of an item as shown: an image's own, a video's poster's. */
export function mediaSize(item: MemberMedia): { width: number; height: number } {
  return item.kind === "image" ? item : item.poster;
}

/** `sizes` for a gallery slide: its rendered width at each row height. */
export function slideSizes(item: MemberMedia): string {
  const { width, height } = mediaSize(item);
  const at = (rowHeight: number) => Math.round((rowHeight * width) / height);
  return `(min-width: 1024px) ${at(ROW_HEIGHT.lg)}px, (min-width: 640px) ${at(ROW_HEIGHT.sm)}px, min(${at(ROW_HEIGHT.base)}px, 85vw)`;
}

/**
 * An optimized poster URL. `<video poster>` takes a single URL and no
 * `srcset`, so it is requested through the image optimizer at roughly twice
 * the displayed width.
 */
export function posterUrl(poster: ImageAsset, displayWidth: number): string {
  const width = Math.min(poster.width, displayWidth);
  const height = Math.round((width / poster.width) * poster.height);
  return getImageProps({ src: poster.src, width, height, alt: "" }).props.src;
}

/** Displayed width of a slide at the largest row height. */
export function slideWidth(item: MemberMedia): number {
  const { width, height } = mediaSize(item);
  return Math.round((ROW_HEIGHT.lg * width) / height);
}
