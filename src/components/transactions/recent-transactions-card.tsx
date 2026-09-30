import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import { getTransactions } from "@/lib/api/get-transactions";
import type { DateRange, Period } from "@/lib/utils/date-range";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatShortDate } from "@/lib/utils/format-date";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/states/empty-state";
import { TransactionStatusBadge } from "./status-badge";

const PREVIEW_COUNT = 6;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface RecentTransactionsCardProps {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

/**
 * Compact "recent activity" widget for the dashboard overview — the full
 * searchable/sortable table lives on `/transactions` (see
 * `TransactionsSection`), matching how Stripe/Linear split an overview
 * preview from the dedicated list page instead of duplicating the same
 * heavy table twice.
 */
export async function RecentTransactionsCard({ period, custom, forceError }: RecentTransactionsCardProps) {
  const transactions = await getTransactions({ period, custom, forceError });
  const recent = transactions.slice(0, PREVIEW_COUNT);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Transações recentes</CardTitle>
          <CardDescription>Últimas {PREVIEW_COUNT} no período selecionado</CardDescription>
        </div>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/transactions" />}>
          Ver todas
          <ArrowRight className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhuma transação"
            description="Não há transações neste período."
          />
        ) : (
          <div className="space-y-1">
            {recent.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/40"
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials(transaction.customer.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{transaction.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{formatShortDate(transaction.date)}</p>
                </div>
                <TransactionStatusBadge status={transaction.status} />
                <p className="w-24 shrink-0 text-right text-sm font-medium tabular-nums">
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
