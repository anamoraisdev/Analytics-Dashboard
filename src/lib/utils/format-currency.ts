const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** `cents` is an integer amount in the smallest currency unit (avoids float drift). */
export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100);
}
