import { describe, expect, it } from "vitest";
import type { Transaction } from "@/types/transaction";
import { transactionsToCsv } from "./export-csv";

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "1",
    customer: { name: "Ana Silva", email: "ana@example.com" },
    amount: 15_000,
    status: "completed",
    date: "2026-01-01",
    ...overrides,
  };
}

describe("transactionsToCsv", () => {
  it("includes a header row and one row per transaction", () => {
    const lines = transactionsToCsv([buildTransaction()]).split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("ID,Cliente,E-mail,Valor (BRL),Status,Data");
    expect(lines[1]).toBe("1,Ana Silva,ana@example.com,150.00,completed,2026-01-01");
  });

  it("quotes fields containing a comma", () => {
    const csv = transactionsToCsv([
      buildTransaction({ customer: { name: "Silva, Ana", email: "a@b.com" } }),
    ]);
    expect(csv).toContain('"Silva, Ana"');
  });

  it("escapes embedded double quotes", () => {
    const csv = transactionsToCsv([
      buildTransaction({ customer: { name: 'Ana "A" Silva', email: "a@b.com" } }),
    ]);
    expect(csv).toContain('"Ana ""A"" Silva"');
  });

  it("returns just the header for an empty list", () => {
    expect(transactionsToCsv([])).toBe("ID,Cliente,E-mail,Valor (BRL),Status,Data");
  });
});
