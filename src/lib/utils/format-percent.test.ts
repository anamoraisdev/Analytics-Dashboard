import { describe, expect, it } from "vitest";
import { formatPercent, formatRate } from "./format-percent";

describe("formatPercent", () => {
  it("shows a leading + for positive deltas", () => {
    expect(formatPercent(0.125)).toBe("+12,5%");
  });

  it("shows a leading - for negative deltas", () => {
    expect(formatPercent(-0.083)).toBe("-8,3%");
  });

  it("shows no sign for exactly zero", () => {
    expect(formatPercent(0)).toBe("0,0%");
  });

  it('renders "—" for the "previous period was zero" sentinel (Infinity)', () => {
    expect(formatPercent(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatPercent(Number.NaN)).toBe("—");
  });
});

describe("formatRate", () => {
  it("formats an absolute rate without a forced sign", () => {
    expect(formatRate(0.325)).toBe("32,5%");
  });

  it("formats zero", () => {
    expect(formatRate(0)).toBe("0,0%");
  });

  it('renders "—" for non-finite input', () => {
    expect(formatRate(Number.POSITIVE_INFINITY)).toBe("—");
  });
});
