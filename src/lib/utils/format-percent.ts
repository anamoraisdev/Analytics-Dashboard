const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

/**
 * `ratio` is a fraction, matching `Metric.deltaPercent` (0.125 → "+12,5%").
 * Non-finite values (the "previous period was zero" sentinel) render as "—".
 */
export function formatPercent(ratio: number): string {
  if (!Number.isFinite(ratio)) return "—";
  return percentFormatter.format(ratio);
}

const plainPercentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Same as `formatPercent` but without a forced +/- sign, for absolute rates like conversion. */
export function formatRate(ratio: number): string {
  if (!Number.isFinite(ratio)) return "—";
  return plainPercentFormatter.format(ratio);
}
