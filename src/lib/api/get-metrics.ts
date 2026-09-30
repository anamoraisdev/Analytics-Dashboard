import { resolveDateRange, type DateRange, type Period } from "@/lib/utils/date-range";
import type { Metric } from "@/types/metrics";
import { withFakeLatency } from "./fake-api";
import { generateMetrics } from "./mock-db/generate-metrics";

interface GetMetricsOptions {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function getMetrics({ period, custom, forceError }: GetMetricsOptions): Promise<Metric[]> {
  const range = resolveDateRange(period, custom);
  return withFakeLatency(() => generateMetrics(range), {
    minMs: 350,
    maxMs: 700,
    errorRate: forceError ? 1 : 0,
  });
}
