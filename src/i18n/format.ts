/**
 * Minimal `{placeholder}` interpolation for translation templates.
 *
 *   format("© {year} {name}", { year: 2026, name: "SKLAD" })
 *   // -> "© 2026 SKLAD"
 */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
