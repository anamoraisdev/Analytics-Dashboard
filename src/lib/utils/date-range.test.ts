import { describe, expect, it } from "vitest";
import {
  enumerateDates,
  getPreviousPeriod,
  isWithinRange,
  normalizePeriod,
  rangeLengthInDays,
  resolveDateRange,
  shiftDate,
} from "./date-range";

// Local-time constructor (not an ISO/UTC string) so the fixture date is
// unambiguous regardless of the timezone the test runner happens to use.
const TODAY = new Date(2026, 8, 28, 12, 0, 0); // 2026-09-28

describe("resolveDateRange", () => {
  it("resolves 7d to a 7-day inclusive window ending today", () => {
    const range = resolveDateRange("7d", undefined, TODAY);
    expect(range).toEqual({ from: "2026-09-22", to: "2026-09-28" });
    expect(rangeLengthInDays(range)).toBe(7);
  });

  it("resolves 30d and 90d to windows of the matching length", () => {
    expect(rangeLengthInDays(resolveDateRange("30d", undefined, TODAY))).toBe(30);
    expect(rangeLengthInDays(resolveDateRange("90d", undefined, TODAY))).toBe(90);
  });

  it("uses a valid custom range as-is", () => {
    const range = resolveDateRange("custom", { from: "2026-01-01", to: "2026-01-10" }, TODAY);
    expect(range).toEqual({ from: "2026-01-01", to: "2026-01-10" });
  });

  it("falls back to 30d when no custom range is supplied", () => {
    expect(rangeLengthInDays(resolveDateRange("custom", undefined, TODAY))).toBe(30);
  });

  it("falls back to 30d when the custom range is inverted (from after to)", () => {
    const range = resolveDateRange("custom", { from: "2026-02-01", to: "2026-01-01" }, TODAY);
    expect(rangeLengthInDays(range)).toBe(30);
  });

  it("falls back to 30d when the custom range is incomplete", () => {
    const range = resolveDateRange("custom", { from: "2026-01-01" }, TODAY);
    expect(rangeLengthInDays(range)).toBe(30);
  });
});

describe("getPreviousPeriod", () => {
  it("returns an equal-length window immediately before, with no gap and no overlap", () => {
    const current = { from: "2026-09-22", to: "2026-09-28" }; // 7 days
    const previous = getPreviousPeriod(current);
    expect(previous).toEqual({ from: "2026-09-15", to: "2026-09-21" });
    expect(rangeLengthInDays(previous)).toBe(rangeLengthInDays(current));
  });

  it("has no gap: previous.to is exactly one day before current.from", () => {
    const previous = getPreviousPeriod({ from: "2026-03-01", to: "2026-03-10" });
    expect(previous.to).toBe("2026-02-28");
  });

  it("has no overlap: previous.to never equals current.from", () => {
    const current = { from: "2026-06-15", to: "2026-06-20" };
    const previous = getPreviousPeriod(current);
    expect(previous.to).not.toBe(current.from);
  });

  it("works for a single-day range", () => {
    expect(getPreviousPeriod({ from: "2026-05-10", to: "2026-05-10" })).toEqual({
      from: "2026-05-09",
      to: "2026-05-09",
    });
  });

  it("correctly crosses a year boundary", () => {
    expect(getPreviousPeriod({ from: "2027-01-01", to: "2027-01-05" })).toEqual({
      from: "2026-12-27",
      to: "2026-12-31",
    });
  });

  it("is idempotent-length across a leap day", () => {
    // Feb 2028 is a leap year; the window still comes out to exactly 29 days back.
    const current = { from: "2028-02-01", to: "2028-02-29" };
    const previous = getPreviousPeriod(current);
    expect(rangeLengthInDays(previous)).toBe(rangeLengthInDays(current));
  });
});

describe("enumerateDates", () => {
  it("returns every date in an inclusive range", () => {
    expect(enumerateDates({ from: "2026-01-01", to: "2026-01-03" })).toEqual([
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
    ]);
  });

  it("returns a single date for a single-day range", () => {
    expect(enumerateDates({ from: "2026-01-01", to: "2026-01-01" })).toEqual(["2026-01-01"]);
  });
});

describe("isWithinRange", () => {
  const range = { from: "2026-01-05", to: "2026-01-10" };

  it("includes both boundaries", () => {
    expect(isWithinRange("2026-01-05", range)).toBe(true);
    expect(isWithinRange("2026-01-10", range)).toBe(true);
  });

  it("excludes dates outside the range", () => {
    expect(isWithinRange("2026-01-04", range)).toBe(false);
    expect(isWithinRange("2026-01-11", range)).toBe(false);
  });
});

describe("shiftDate", () => {
  it("shifts forward and backward, including across month/year boundaries", () => {
    expect(shiftDate("2026-01-01", 1)).toBe("2026-01-02");
    expect(shiftDate("2026-01-01", -1)).toBe("2025-12-31");
  });
});

describe("normalizePeriod", () => {
  it("accepts every valid period value", () => {
    expect(normalizePeriod("7d")).toBe("7d");
    expect(normalizePeriod("30d")).toBe("30d");
    expect(normalizePeriod("90d")).toBe("90d");
    expect(normalizePeriod("custom")).toBe("custom");
  });

  it("falls back to 30d for anything unrecognized or missing", () => {
    expect(normalizePeriod("bogus")).toBe("30d");
    expect(normalizePeriod(undefined)).toBe("30d");
    expect(normalizePeriod("")).toBe("30d");
  });

  it("takes the first value when Next.js repeats the param as an array", () => {
    expect(normalizePeriod(["90d", "7d"])).toBe("90d");
  });
});
