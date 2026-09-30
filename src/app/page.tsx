import { Suspense } from "react";
import type { Metadata } from "next";
import { shouldForceFail } from "@/lib/api/fake-api";
import { normalizePeriod, type DateRange } from "@/lib/utils/date-range";
import { firstSearchParam, type SearchParams } from "@/lib/utils/search-params";
import { ChartSkeleton } from "@/components/states/chart-skeleton";
import { DashboardErrorBoundary } from "@/components/states/error-boundary";
import { MetricCardGridSkeleton } from "@/components/states/metric-card-skeleton";
import { RecentTransactionsSkeleton } from "@/components/states/table-skeleton";
import { LiveIndicator } from "@/components/dashboard/live-indicator";
import { MetricCardGrid } from "@/components/dashboard/metric-card-grid";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { RevenueChartSection } from "@/components/dashboard/revenue-chart-section";
import { UsersChartSection } from "@/components/dashboard/users-chart-section";
import { RecentTransactionsCard } from "@/components/transactions/recent-transactions-card";

export const metadata: Metadata = { title: "Visão geral" };

interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * The dashboard reads the period/range straight from `searchParams` (see the
 * architecture note on URL-driven filters) and fans out into one
 * Suspense + error boundary per section, so each card/chart/table streams in
 * and fails independently instead of gating the whole page on the slowest
 * fetch.
 */
export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const custom: Partial<DateRange> | undefined =
    period === "custom"
      ? { from: firstSearchParam(params.from), to: firstSearchParam(params.to) }
      : undefined;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight">Visão geral</h1>
            <LiveIndicator />
          </div>
          <p className="text-sm text-muted-foreground">Acompanhe as métricas-chave da sua empresa.</p>
        </div>
        <PeriodFilter />
      </div>

      <DashboardErrorBoundary sectionLabel="as métricas">
        <Suspense fallback={<MetricCardGridSkeleton />}>
          <MetricCardGrid period={period} custom={custom} forceError={shouldForceFail(params, "metrics")} />
        </Suspense>
      </DashboardErrorBoundary>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardErrorBoundary sectionLabel="o gráfico de receita">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChartSection
              period={period}
              custom={custom}
              forceError={shouldForceFail(params, "revenue")}
            />
          </Suspense>
        </DashboardErrorBoundary>

        <DashboardErrorBoundary sectionLabel="o gráfico de usuários">
          <Suspense fallback={<ChartSkeleton />}>
            <UsersChartSection period={period} custom={custom} forceError={shouldForceFail(params, "users")} />
          </Suspense>
        </DashboardErrorBoundary>
      </div>

      <DashboardErrorBoundary sectionLabel="as transações recentes">
        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactionsCard
            period={period}
            custom={custom}
            forceError={shouldForceFail(params, "transactions")}
          />
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}
