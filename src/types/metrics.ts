import type { TimeSeriesPoint } from "./timeseries";

export type MetricKey = "revenue" | "users" | "orders" | "conversionRate";

export interface Metric {
  key: MetricKey;
  label: string;
  /** Currency metrics are in cents (integer) to avoid float drift; others are plain counts/ratios. */
  value: number;
  /** Same shape as `value`, for the equivalent immediately-preceding period. */
  previousValue: number;
  /** Fraction, e.g. 0.125 = +12.5%. `Infinity` means "previous period was zero" — render as "Novo". */
  deltaPercent: number;
  format: "currency" | "number" | "percent";
  /** Last few points of the underlying series, for the card's mini trend line. */
  sparkline?: TimeSeriesPoint[];
}
