"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Muted previews play only when motion is welcome and data is not being saved. */
function canAutoplay() {
  const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
  return !window.matchMedia(REDUCED_MOTION).matches && !saveData;
}

/**
 * A member's video as a silent, looping preview inside the gallery. Nothing is
 * downloaded until it scrolls into view; it plays while at least a third of it
 * is visible and pauses otherwise, or while `paused` is set (the lightbox is
 * open). Without autoplay the poster stays and the lightbox plays the video.
 */
export function ShowcaseVideo({
  src,
  poster,
  paused,
  className,
}: {
  src: string;
  poster: string;
  paused: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const autoplay = useSyncExternalStore(subscribe, canAutoplay, () => false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoplay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !paused) {
          video.play().catch(() => {
            /* Autoplay can still be refused (e.g. low-power mode); the poster stays. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoplay, paused]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    />
  );
}
