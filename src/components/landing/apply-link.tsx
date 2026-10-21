import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The one primary action: the application form, which is also how a tour is
 * booked. Wraps the generated button styles with the 48 px hit area and 16 px
 * text the page uses for its main controls, without editing the primitive.
 */
export function ApplyLink({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <a
      href={siteConfig.applyHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant, size: "lg" }),
        "h-12 rounded-lg px-6 text-base font-semibold",
        className,
      )}
    >
      {children}
    </a>
  );
}
