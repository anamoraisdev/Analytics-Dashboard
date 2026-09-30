import { format } from "date-fns";
import { describe, expect, it } from "vitest";
import { shiftDate, type DateRange } from "@/lib/utils/date-range";
import { generateRevenueSeries } from "./generate-revenue-series";

const TODAY = format(new Date(), "yyyy-MM-dd");
const LAST_7_DAYS: DateRange = { from: shiftDate(TODAY, -6), to: TODAY };

describe("generateRevenueSeries", () => {
  it("is deterministic for the same range", () => {
    expect(generateRevenueSeries(LAST_7_DAYS)).toEqual(generateRevenueSeries({ ...LAST_7_DAYS }));
  });

  it("produces one point per day for short ranges (daily granularity), ending today", () => {
    const series = generateRevenueSeries(LAST_7_DAYS);
    expect(series.granularity).toBe("day");
    expect(series.points).toHaveLength(7);
    expect(series.points.at(-1)?.date).toBe(TODAY);
  });

  it("only produces non-negative integer cent amounts", () => {
    for (const point of generateRevenueSeries(LAST_7_DAYS).points) {
      expect(Number.isInteger(point.value)).toBe(true);
      expect(point.value).toBeGreaterThanOrEqual(0);
    }
  });

  it("rolls up into weekly buckets once the range exceeds 60 days", () => {
    const longRange: DateRange = { from: shiftDate(TODAY, -99), to: TODAY }; // 100 days
    const series = generateRevenueSeries(longRange);
    expect(series.granularity).toBe("week");
    expect(series.points.length).toBeLessThan(100);
  });

  it("sums only completed transactions, within a plausible daily range", () => {
    const series = generateRevenueSeries({ from: shiftDate(TODAY, -29), to: TODAY });
    const total = series.points.reduce((sum, point) => sum + point.value, 0);
    expect(total).toBeGreaterThan(0);
    // Sanity bound, not a snapshot: 30 days of a handful of orders/day
    // shouldn't plausibly exceed a few hundred thousand reais.
    expect(total).toBeLessThan(500_000_00);
  });
});
