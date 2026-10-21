/**
 * The two inline constructs a member bio may use, kept deliberately tiny so
 * catalogs stay plain JSON and nothing is ever rendered as raw HTML:
 *
 *   **Plantáž**                       → highlight
 *   [notysky.cz](https://notysky.cz/) → external link (http/https only)
 *
 * Anything else, including unmatched markers, stays literal text.
 */
export type InlineToken =
  | { type: "text"; text: string }
  | { type: "highlight"; text: string }
  | { type: "link"; text: string; href: string };

const INLINE_PATTERN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseInline(source: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let cursor = 0;

  for (const match of source.matchAll(INLINE_PATTERN)) {
    if (match.index > cursor) {
      tokens.push({ type: "text", text: source.slice(cursor, match.index) });
    }
    const [, highlight, label, href] = match;
    tokens.push(
      highlight !== undefined
        ? { type: "highlight", text: highlight }
        : { type: "link", text: label, href },
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < source.length) {
    tokens.push({ type: "text", text: source.slice(cursor) });
  }

  return tokens;
}

/** The same text with the markup removed — for metadata and structured data. */
export function stripInline(source: string): string {
  return parseInline(source)
    .map((token) => token.text)
    .join("");
}
