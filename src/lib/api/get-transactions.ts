import { resolveDateRange, type DateRange, type Period } from "@/lib/utils/date-range";
import type { Transaction } from "@/types/transaction";
import { withFakeLatency } from "./fake-api";
import { generateTransactions } from "./mock-db/generate-transactions";

interface GetTransactionsOptions {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function getTransactions({
  period,
  custom,
  forceError,
}: GetTransactionsOptions): Promise<Transaction[]> {
  const range = resolveDateRange(period, custom);
  // Slightly slower than the cards on purpose: in a real backend the table
  // is the heaviest query, and it's what makes per-section Suspense visible.
  return withFakeLatency(() => generateTransactions(range), {
    minMs: 600,
    maxMs: 1200,
    errorRate: forceError ? 1 : 0,
  });
}
