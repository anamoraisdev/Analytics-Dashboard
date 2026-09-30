import { format } from "date-fns";
import { isWithinRange, shiftDate, type DateRange } from "@/lib/utils/date-range";
import type { Transaction } from "@/types/transaction";
import transactionsFixture from "./data/transactions.json";

interface TransactionFixture {
  /** Offset from "today", not an absolute date — see scripts/generate-fixtures.mjs. */
  daysAgo: number;
  customer: { name: string; email: string };
  amount: number;
  status: Transaction["status"];
}

const FIXTURES = transactionsFixture as TransactionFixture[];

/**
 * Resolves the static `data/transactions.json` fixture into the requested
 * range, sorted newest first. The fixture stores each transaction as "N days
 * ago" rather than an absolute date, so the dataset always looks current no
 * matter when the app is viewed/deployed — and it's a real, inspectable and
 * editable JSON file rather than pure in-memory randomness (regenerate it
 * with `node scripts/generate-fixtures.mjs`).
 */
export function generateTransactions(range: DateRange): Transaction[] {
  const today = format(new Date(), "yyyy-MM-dd");

  return FIXTURES.map((fixture, index) => ({
    id: `txn_${fixture.daysAgo}_${index}`,
    customer: fixture.customer,
    amount: fixture.amount,
    status: fixture.status,
    date: shiftDate(today, -fixture.daysAgo),
  }))
    .filter((transaction) => isWithinRange(transaction.date, range))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
