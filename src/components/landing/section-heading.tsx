import { cn } from "@/lib/utils";

/**
 * Section title in the expanded display cut, with an optional lead paragraph.
 * The title's id names the surrounding section landmark.
 */
export function SectionHeading({
  id,
  title,
  text,
  className,
}: {
  id: string;
  title: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-5", className)}>
      <h2 id={id} className="font-display text-[2.25rem] text-balance sm:text-5xl lg:text-[3.5rem]">
        {title}
      </h2>
      {text ? (
        <p className="max-w-[60ch] text-lg leading-relaxed text-pretty text-muted-foreground">
          {text}
        </p>
      ) : null}
    </div>
  );
}
