import { format, parseISO, startOfWeek } from "date-fns";
import { enumerateDates, type DateRange } from "@/lib/utils/date-range";
import type { RevenueSeries, TimeSeriesPoint } from "@/types/timeseries";
import { generateTransactions } from "./generate-transactions";

/**
 * Daily revenue, derived by summing `completed` transaction amounts from the
 * same fixture that backs the transactions table — rather than an
 * independent random series — so the chart's totals and the rows a user
 * actually sees always agree with each other.
 *
 * Ranges longer than 60 days are rolled up into weekly buckets — a 90-day
 * view of raw daily points would be too dense to read, mirroring how real
 * analytics products degrade granularity for wider windows.
 */
export function generateRevenueSeries(range: DateRange): RevenueSeries {
  const dates = enumerateDates(range);
  const transactions = generateTransactions(range);

  const revenueByDate = new Map<string, number>();
  for (const transaction of transactions) {
    if (transaction.status !== "completed") continue;
    revenueByDate.set(transaction.date, (revenueByDate.get(transaction.date) ?? 0) + transaction.amount);
  }

  const dailyPoints: TimeSeriesPoint[] = dates.map((date) => ({
    date,
    value: revenueByDate.get(date) ?? 0,
  }));

  if (dailyPoints.length <= 60) {
    return { points: dailyPoints, granularity: "day" };
  }

  return { points: aggregateByWeek(dailyPoints), granularity: "week" };
}

function aggregateByWeek(points: TimeSeriesPoint[]): TimeSeriesPoint[] {
  const weekTotals = new Map<string, number>();
  for (const point of points) {
    const weekStart = format(startOfWeek(parseISO(point.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
    weekTotals.set(weekStart, (weekTotals.get(weekStart) ?? 0) + point.value);
  }
  return [...weekTotals.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, value]) => ({ date, value }));
}
