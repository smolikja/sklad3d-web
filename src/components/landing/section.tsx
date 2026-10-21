import { cn } from "@/lib/utils";

/** Page width and side padding shared by every band of the page (tokens in globals.css). */
export const containerClassName = "mx-auto w-full max-w-(--page-max) px-(--page-gutter)";

/**
 * A content band below the hero: a hairline on top, generous vertical rhythm,
 * and an anchor offset that clears the sticky header.
 */
export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id?: string;
  /** Id of the section's heading, so the landmark has a name. */
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-16 border-t py-20 sm:py-28", className)}
    >
      <div className={containerClassName}>{children}</div>
    </section>
  );
}
