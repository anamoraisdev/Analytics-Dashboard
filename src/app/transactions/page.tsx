import { Suspense } from "react";
import type { Metadata } from "next";
import { shouldForceFail } from "@/lib/api/fake-api";
import { normalizePeriod, type DateRange } from "@/lib/utils/date-range";
import { firstSearchParam, type SearchParams } from "@/lib/utils/search-params";
import { DashboardErrorBoundary } from "@/components/states/error-boundary";
import { TableSkeleton } from "@/components/states/table-skeleton";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { TransactionsSection } from "@/components/transactions/transactions-section";

export const metadata: Metadata = { title: "Transações" };

interface TransactionsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const custom: Partial<DateRange> | undefined =
    period === "custom"
      ? { from: firstSearchParam(params.from), to: firstSearchParam(params.to) }
      : undefined;
  // Seeded once from the Header's global search redirect (`/transactions?q=...`).
  const initialQuery = firstSearchParam(params.q);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transações</h1>
          <p className="text-sm text-muted-foreground">Todas as transações registradas no período.</p>
        </div>
        <PeriodFilter />
      </div>

      <DashboardErrorBoundary sectionLabel="as transações">
        <Suspense fallback={<TableSkeleton />}>
          <TransactionsSection
            period={period}
            custom={custom}
            forceError={shouldForceFail(params, "transactions")}
            initialQuery={initialQuery}
          />
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}
