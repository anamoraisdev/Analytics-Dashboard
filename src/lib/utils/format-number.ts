const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

const compactNumberFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** For dense contexts (axis ticks, sparkline labels): 12.400 → "12,4 mil". */
export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}
