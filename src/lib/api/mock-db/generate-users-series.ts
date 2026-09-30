import { enumerateDates, type DateRange } from "@/lib/utils/date-range";
import type { UsersSeries } from "@/types/timeseries";
import { createRandom, randomInRange } from "../prng";

/**
 * New vs. active users per day. Active users ride on top of a slowly
 * accumulating retained base plus that day's new signups, which is what
 * makes the "active" line trend upward even while "new" fluctuates day to
 * day — the same visual shape a real combined chart would show.
 */
export function generateUsersSeries(range: DateRange): UsersSeries {
  const dates = enumerateDates(range);
  const random = createRandom(`users:${range.from}:${range.to}`);
  const newUsersBaseline = randomInRange(random, 18, 45);
  let retainedBase = randomInRange(random, 400, 900);

  const points = dates.map((date, index) => {
    const trend = 1 + (index / dates.length) * 0.25;
    const noise = randomInRange(random, 0.7, 1.3);
    const newUsers = Math.max(0, Math.round(newUsersBaseline * trend * noise));

    retainedBase += newUsers * randomInRange(random, 0.5, 0.8); // partial retention
    retainedBase *= 0.995; // slow churn
    const activeUsers = Math.round(retainedBase + newUsers * randomInRange(random, 0.3, 0.6));

    return { date, newUsers, activeUsers };
  });

  return { points };
}
