import { describe, expect, it } from "vitest";
import { formatCurrency } from "./format-currency";

// pt-BR's Intl currency format uses a non-breaking space (U+00A0) between the
// "R$" symbol and the amount — a plain space in the expected string would
// silently never match.
const NBSP = " ";

describe("formatCurrency", () => {
  it("formats whole reais from cents", () => {
    expect(formatCurrency(150_000)).toBe(`R$${NBSP}1.500,00`);
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe(`R$${NBSP}0,00`);
  });

  it("formats negative amounts (e.g. refunds)", () => {
    expect(formatCurrency(-2_500)).toBe(`-R$${NBSP}25,00`);
  });

  it("formats sub-real amounts", () => {
    expect(formatCurrency(99)).toBe(`R$${NBSP}0,99`);
  });
});
