/** Lower-case, hyphen-separated slug, equivalent to lodash kebabCase for the tags used on this site. */
export function kebabCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

/**
 * Parse a frontmatter date. Date-only strings ("2018-05-14") are treated as
 * UTC midnight so they never shift to the previous day when formatted.
 */
export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
}

const longFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "2-digit",
  timeZone: "UTC",
});

/** "MMMM DD, YYYY", e.g. "May 14, 2018" */
export function formatLongDate(date: Date): string {
  return longFormatter.format(date);
}

/** "YYYY-MM-DD" */
export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
