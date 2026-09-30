export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";

export interface Transaction {
  id: string;
  customer: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  /** Amount in cents (integer), same convention as `Metric.value` for currency metrics. */
  amount: number;
  status: TransactionStatus;
  /** ISO date, yyyy-MM-dd */
  date: string;
}
