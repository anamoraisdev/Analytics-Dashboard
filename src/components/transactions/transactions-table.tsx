"use client";

import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import type { Transaction } from "@/types/transaction";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { useTableSort } from "@/hooks/use-table-sort";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatShortDate } from "@/lib/utils/format-date";
import { downloadCsv, transactionsToCsv } from "@/lib/utils/export-csv";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { Pagination } from "./pagination";
import { SortHeaderButton } from "./sort-header-button";
import { TransactionStatusBadge } from "./status-badge";
import { TransactionsToolbar } from "./toolbar";

type SortableColumn = "customer" | "amount" | "status" | "date";

// Order here drives the `<thead>` column order below — must match the
// `<td>` order in the `<tbody>` rows (Cliente, Data, Valor, Status).
const COLUMN_LABELS: Record<SortableColumn, string> = {
  customer: "Cliente",
  date: "Data",
  amount: "Valor",
  status: "Status",
};

function getSortValue(transaction: Transaction, key: SortableColumn): string | number {
  switch (key) {
    case "customer":
      return transaction.customer.name.toLowerCase();
    case "amount":
      return transaction.amount;
    case "status":
      return transaction.status;
    case "date":
      return transaction.date;
  }
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface TransactionsTableProps {
  transactions: Transaction[];
  /** Seeds the search box once, from the Header's global search redirect (`?q=`). */
  initialQuery?: string;
}

/**
 * Owns search, sort and pagination locally (not in the URL) — the server
 * already filtered by date range, and re-filtering/sorting a few hundred
 * rows client-side is instant, so there's no reason to round-trip to the
 * fake API for every keystroke.
 */
export function TransactionsTable({ transactions, initialQuery = "" }: TransactionsTableProps) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncedValue(query);

  const filtered = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return transactions;
    return transactions.filter(
      (transaction) =>
        transaction.customer.name.toLowerCase().includes(term) ||
        transaction.customer.email.toLowerCase().includes(term)
    );
  }, [transactions, debouncedQuery]);

  const { sorted, sortKey, direction, toggleSort } = useTableSort<Transaction, SortableColumn>({
    data: filtered,
    getValue: getSortValue,
    initialKey: "date",
  });

  const { pageItems, page, totalPages, goToPage } = useTablePagination(sorted, 8);

  function handleExport() {
    const filename = `pulse-transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, transactionsToCsv(sorted));
  }

  return (
    <div className="space-y-4">
      <TransactionsToolbar
        query={query}
        onQueryChange={setQuery}
        resultCount={filtered.length}
        onExport={handleExport}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhuma transação encontrada"
          description={query ? `Nenhum resultado para "${query}".` : "Não há transações neste período."}
          action={
            query ? (
              <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                Limpar busca
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop/tablet: real table. A 6-column table is unreadable under `lg`, so it's replaced by cards there. */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {(Object.keys(COLUMN_LABELS) as SortableColumn[]).map((column) => (
                    <th
                      key={column}
                      className={`px-3 py-2 ${column === "amount" ? "text-right" : "text-left"}`}
                    >
                      <SortHeaderButton
                        column={column}
                        label={COLUMN_LABELS[column]}
                        activeColumn={sortKey}
                        direction={direction}
                        onToggle={toggleSort}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm">
                          <AvatarFallback>{initials(transaction.customer.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{transaction.customer.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{transaction.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{formatShortDate(transaction.date)}</td>
                    <td className="px-3 py-3 text-right font-medium tabular-nums">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-3 py-3">
                      <TransactionStatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/tablet: card list mirroring the same data as the table above. */}
          <div className="space-y-2 lg:hidden">
            {pageItems.map((transaction) => (
              <div key={transaction.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>{initials(transaction.customer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{transaction.customer.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{transaction.customer.email}</p>
                  </div>
                  <p className="shrink-0 font-medium tabular-nums">{formatCurrency(transaction.amount)}</p>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <TransactionStatusBadge status={transaction.status} />
                  <span className="text-xs text-muted-foreground">{formatShortDate(transaction.date)}</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
}
