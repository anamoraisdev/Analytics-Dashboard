import { getMetrics } from "@/lib/api/get-metrics";
import type { DateRange, Period } from "@/lib/utils/date-range";
import { MetricCard } from "./metric-card";

interface MetricCardGridProps {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function MetricCardGrid({ period, custom, forceError }: MetricCardGridProps) {
  const metrics = await getMetrics({ period, custom, forceError });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.key} metric={metric} />
      ))}
    </div>
  );
}
