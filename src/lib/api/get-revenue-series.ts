import { resolveDateRange, type DateRange, type Period } from "@/lib/utils/date-range";
import type { RevenueSeries } from "@/types/timeseries";
import { withFakeLatency } from "./fake-api";
import { generateRevenueSeries } from "./mock-db/generate-revenue-series";

interface GetRevenueSeriesOptions {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function getRevenueSeries({
  period,
  custom,
  forceError,
}: GetRevenueSeriesOptions): Promise<RevenueSeries> {
  const range = resolveDateRange(period, custom);
  return withFakeLatency(() => generateRevenueSeries(range), {
    minMs: 500,
    maxMs: 950,
    errorRate: forceError ? 1 : 0,
  });
}
