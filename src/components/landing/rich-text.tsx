import { parseInline } from "@/lib/inline-markup";

/**
 * Renders one catalog paragraph with its inline markup (see
 * `src/lib/inline-markup.ts`) as React elements — never as raw HTML.
 */
export function RichText({ text }: { text: string }) {
  return parseInline(text).map((token, index) => {
    switch (token.type) {
      case "highlight":
        return (
          <strong key={index} className="font-semibold text-primary">
            {token.text}
          </strong>
        );
      case "link":
        return (
          <a
            key={index}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {token.text}
          </a>
        );
      default:
        return token.text;
    }
  });
}
