import { resolveDateRange, type DateRange, type Period } from "@/lib/utils/date-range";
import type { UsersSeries } from "@/types/timeseries";
import { withFakeLatency } from "./fake-api";
import { generateUsersSeries } from "./mock-db/generate-users-series";

interface GetUsersSeriesOptions {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function getUsersSeries({
  period,
  custom,
  forceError,
}: GetUsersSeriesOptions): Promise<UsersSeries> {
  const range = resolveDateRange(period, custom);
  return withFakeLatency(() => generateUsersSeries(range), {
    minMs: 500,
    maxMs: 950,
    errorRate: forceError ? 1 : 0,
  });
}
