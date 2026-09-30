import type { Transaction } from "@/types/transaction";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Pure and independently testable — the actual download side-effect lives in `downloadCsv`. */
export function transactionsToCsv(transactions: Transaction[]): string {
  const header = ["ID", "Cliente", "E-mail", "Valor (BRL)", "Status", "Data"];
  const rows = transactions.map((transaction) => [
    transaction.id,
    transaction.customer.name,
    transaction.customer.email,
    (transaction.amount / 100).toFixed(2),
    transaction.status,
    transaction.date,
  ]);
  return [header, ...rows].map((row) => row.map(escapeCsvField).join(",")).join("\n");
}

/** Browser-only side effect: triggers a real file download for `content`. */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
