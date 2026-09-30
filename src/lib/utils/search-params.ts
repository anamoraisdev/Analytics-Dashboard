/** Shape of Next.js's (possibly multi-value) `searchParams` prop. */
export type SearchParams = Record<string, string | string[] | undefined>;

/** Next.js repeats a `?key=a&key=b` param as a string[] — most of our filters only care about the first value. */
export function firstSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
