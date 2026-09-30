import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";

export type Period = "7d" | "30d" | "90d" | "custom";

export interface DateRange {
  /** ISO date, yyyy-MM-dd, inclusive */
  from: string;
  /** ISO date, yyyy-MM-dd, inclusive */
  to: string;
}

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "custom", label: "Personalizado" },
];

const DAYS_BY_PERIOD: Record<Exclude<Period, "custom">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const VALID_PERIOD_VALUES = new Set<string>(PERIOD_OPTIONS.map((option) => option.value));

/** Validates an untrusted `?period=` search param, falling back to "30d" for anything unrecognized. */
export function normalizePeriod(value: string | string[] | undefined): Period {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && VALID_PERIOD_VALUES.has(candidate) ? (candidate as Period) : "30d";
}

function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function isValidRange(range: Partial<DateRange> | undefined): range is DateRange {
  if (!range?.from || !range?.to) return false;
  const from = parseISO(range.from);
  const to = parseISO(range.to);
  return !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from <= to;
}

/**
 * Resolves a `Period` into a concrete inclusive `DateRange`, anchored to "today".
 * "custom" falls back to a 30-day window when no valid range is supplied, so
 * every downstream consumer can assume a well-formed range.
 */
export function resolveDateRange(
  period: Period,
  custom?: Partial<DateRange>,
  today: Date = new Date()
): DateRange {
  const effectivePeriod = period === "custom" && !isValidRange(custom) ? "30d" : period;

  if (effectivePeriod === "custom") {
    // isValidRange narrowed `custom` above, but TS can't see that across the ternary.
    const range = custom as DateRange;
    return { from: range.from, to: range.to };
  }

  const end = startOfDay(today);
  const days = DAYS_BY_PERIOD[effectivePeriod];
  const start = subDays(end, days - 1); // inclusive window of exactly `days` days

  return { from: toISODate(start), to: toISODate(end) };
}

/** Number of days spanned by an inclusive range (e.g. a 7d period → 7). */
export function rangeLengthInDays(range: DateRange): number {
  return differenceInCalendarDays(parseISO(range.to), parseISO(range.from)) + 1;
}

/**
 * The immediately preceding window of the same length, with no gap and no
 * overlap — used to compute "vs. previous period" deltas on metric cards.
 * This is the highest-risk piece of date math in the app (an off-by-one here
 * silently corrupts every delta%), so it's covered exhaustively in tests.
 */
export function getPreviousPeriod(range: DateRange): DateRange {
  const length = rangeLengthInDays(range);
  const previousTo = subDays(parseISO(range.from), 1);
  const previousFrom = subDays(previousTo, length - 1);
  return { from: toISODate(previousFrom), to: toISODate(previousTo) };
}

/** Every calendar date in the range, inclusive, as ISO strings. */
export function enumerateDates(range: DateRange): string[] {
  return eachDayOfInterval({ start: parseISO(range.from), end: parseISO(range.to) }).map(
    toISODate
  );
}

/** Safe on yyyy-MM-dd strings because lexicographic order matches chronological order. */
export function isWithinRange(dateISO: string, range: DateRange): boolean {
  return dateISO >= range.from && dateISO <= range.to;
}

export function shiftDate(dateISO: string, deltaDays: number): string {
  return toISODate(addDays(parseISO(dateISO), deltaDays));
}
