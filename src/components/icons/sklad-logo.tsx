import { cn } from "@/lib/utils";

/**
 * The SKLAD mark: one RGB pixel, its three subpixels side by side (the same
 * geometry as `public/brand/logo.svg`). Decorative — the surrounding link or
 * heading carries the accessible name.
 */
export function SkladLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 648 326"
      aria-hidden="true"
      focusable="false"
      className={cn("h-5 w-auto shrink-0", className)}
    >
      <rect width="194" height="326" rx="14" className="fill-subpixel-r" />
      <rect x="227" width="194" height="326" rx="14" className="fill-subpixel-g" />
      <rect x="454" width="194" height="326" rx="14" className="fill-subpixel-b" />
    </svg>
  );
}
