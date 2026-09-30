import { ChartSkeleton } from "@/components/states/chart-skeleton";
import { MetricCardGridSkeleton } from "@/components/states/metric-card-skeleton";
import { RecentTransactionsSkeleton } from "@/components/states/table-skeleton";

/**
 * Route-level fallback. In practice this rarely shows: `page.tsx` only
 * awaits the (near-instant) `searchParams` promise before returning, and the
 * actually slow work is streamed per-section via nested `<Suspense>`
 * boundaries. This exists as the safety net for that brief gap.
 */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="h-8" />
      <MetricCardGridSkeleton />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <RecentTransactionsSkeleton />
    </div>
  );
}
