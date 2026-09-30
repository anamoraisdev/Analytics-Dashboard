import { describe, expect, it } from "vitest";
import { formatCompactNumber, formatNumber } from "./format-number";

describe("formatNumber", () => {
  it("uses pt-BR thousands separators", () => {
    expect(formatNumber(12_345)).toBe("12.345");
  });

  it("formats zero and negative numbers", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(-42)).toBe("-42");
  });
});

describe("formatCompactNumber", () => {
  it("abbreviates large numbers", () => {
    // pt-BR's compact format uses a non-breaking space (U+00A0) before the unit.
    expect(formatCompactNumber(12_400)).toBe(`12,4${String.fromCharCode(0xa0)}mil`);
  });

  it("leaves small numbers as-is", () => {
    expect(formatCompactNumber(950)).toBe("950");
  });
});
