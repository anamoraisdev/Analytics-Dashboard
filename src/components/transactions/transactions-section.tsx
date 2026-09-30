import { getTransactions } from "@/lib/api/get-transactions";
import type { DateRange, Period } from "@/lib/utils/date-range";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "./transactions-table";

interface TransactionsSectionProps {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
  initialQuery?: string;
}

/** The full, searchable/sortable/paginated table — used on the dedicated `/transactions` page. */
export async function TransactionsSection({
  period,
  custom,
  forceError,
  initialQuery,
}: TransactionsSectionProps) {
  const transactions = await getTransactions({ period, custom, forceError });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
        <CardDescription>Todas as transações no período selecionado</CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionsTable transactions={transactions} initialQuery={initialQuery} />
      </CardContent>
    </Card>
  );
}
