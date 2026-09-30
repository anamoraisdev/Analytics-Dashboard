import { describe, expect, it } from "vitest";
import { formatDateTime, formatFullDate, formatShortDate } from "./format-date";

describe("formatShortDate", () => {
  it("formats as day + abbreviated month in pt-BR", () => {
    expect(formatShortDate("2026-03-05")).toBe("5 mar");
  });
});

describe("formatFullDate", () => {
  it("formats the full pt-BR date", () => {
    expect(formatFullDate("2026-03-05")).toBe("5 de março de 2026");
  });
});

describe("formatDateTime", () => {
  it("appends a time component", () => {
    expect(formatDateTime("2026-03-05")).toBe("5 mar 2026, 00:00");
  });
});
