import { cn } from "@/lib/utils";

/** Page width and side padding shared by every band of the page (tokens in globals.css). */
export const containerClassName = "mx-auto w-full max-w-(--page-max) px-(--page-gutter)";

/**
 * A content band below the hero: a hairline on top, generous vertical rhythm,
 * and an anchor offset that clears the sticky header. It is at least one full
 * screen tall, with its content vertically centred, so every topic gets its
 * own screen and long ones simply grow. `lvh` is the
 * largest viewport height, so a section still fills the screen when a mobile
 * browser hides its toolbar.
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
      className={cn(
        "flex min-h-lvh scroll-mt-16 flex-col justify-center border-t py-20 sm:py-28",
        className,
      )}
    >
      <div className={containerClassName}>{children}</div>
    </section>
  );
}
