import { format } from "date-fns";
import { describe, expect, it } from "vitest";
import { shiftDate, type DateRange } from "@/lib/utils/date-range";
import { generateTransactions } from "./generate-transactions";

// The fixture stores "days ago" offsets, not absolute dates (see
// scripts/generate-fixtures.mjs), so every range in these tests is built
// relative to the real "today" instead of a fixed historical date.
const TODAY = format(new Date(), "yyyy-MM-dd");
const LAST_7_DAYS: DateRange = { from: shiftDate(TODAY, -6), to: TODAY };
const VALID_STATUSES = ["completed", "pending", "refunded", "failed"];

describe("generateTransactions", () => {
  it("is deterministic for the same range", () => {
    expect(generateTransactions(LAST_7_DAYS)).toEqual(generateTransactions({ ...LAST_7_DAYS }));
  });

  it("only returns transactions dated within the range", () => {
    for (const transaction of generateTransactions(LAST_7_DAYS)) {
      expect(transaction.date >= LAST_7_DAYS.from).toBe(true);
      expect(transaction.date <= LAST_7_DAYS.to).toBe(true);
    }
  });

  it("sorts transactions newest first", () => {
    const dates = generateTransactions({ from: shiftDate(TODAY, -29), to: TODAY }).map(
      (transaction) => transaction.date
    );
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("generates unique ids", () => {
    const transactions = generateTransactions({ from: shiftDate(TODAY, -89), to: TODAY });
    expect(new Set(transactions.map((transaction) => transaction.id)).size).toBe(
      transactions.length
    );
  });

  it("only uses valid statuses", () => {
    for (const transaction of generateTransactions(LAST_7_DAYS)) {
      expect(VALID_STATUSES).toContain(transaction.status);
    }
  });

  it("only produces positive integer cent amounts", () => {
    for (const transaction of generateTransactions(LAST_7_DAYS)) {
      expect(Number.isInteger(transaction.amount)).toBe(true);
      expect(transaction.amount).toBeGreaterThan(0);
    }
  });

  it("returns an empty list for a range entirely before the fixture's coverage", () => {
    const farPast: DateRange = { from: shiftDate(TODAY, -400), to: shiftDate(TODAY, -300) };
    expect(generateTransactions(farPast)).toEqual([]);
  });

  it("has data across the full 90-day window the widest filter needs", () => {
    const transactions = generateTransactions({ from: shiftDate(TODAY, -89), to: TODAY });
    const daysWithData = new Set(transactions.map((transaction) => transaction.date));
    expect(daysWithData.size).toBeGreaterThan(80);
  });
});
