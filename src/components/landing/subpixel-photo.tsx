import Image from "next/image";

import type { ImageAsset } from "@/config/members";
import { cn } from "@/lib/utils";

/**
 * Each layer keeps one colour channel of the photo: multiplying by pure red,
 * green or blue zeroes the other two. Screen-blending the three layers on black
 * adds the channels back up to the original photo.
 */
const channels = [
  { tint: "bg-subpixel-r", motion: "motion-safe:animate-converge-r" },
  { tint: "bg-subpixel-g", motion: "" },
  { tint: "bg-subpixel-b", motion: "motion-safe:animate-converge-b" },
] as const;

/**
 * The page's one orchestrated moment, taken from the logo: on load the studio
 * photo arrives as its red, green and blue subpixels, offset sideways, and
 * they converge into the full-colour image. Pure CSS, so it needs no
 * JavaScript; with reduced motion the layers start aligned and the photo is
 * simply there.
 *
 * All three layers request the same URL, so the photo is downloaded once.
 */
export function SubpixelPhoto({
  image,
  alt,
  sizes,
  className,
}: {
  image: ImageAsset;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative isolate overflow-hidden bg-black", className)}
      role="img"
      aria-label={alt}
    >
      {channels.map((channel, index) => (
        <div key={channel.tint} className={cn("absolute inset-0 mix-blend-screen", channel.motion)}>
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes={sizes}
            // The first layer is the likely LCP element; the others reuse its request.
            loading="eager"
            fetchPriority={index === 0 ? "high" : "auto"}
            className="size-full object-cover"
          />
          <div aria-hidden="true" className={cn("absolute inset-0 mix-blend-multiply", channel.tint)} />
        </div>
      ))}
    </div>
  );
}
