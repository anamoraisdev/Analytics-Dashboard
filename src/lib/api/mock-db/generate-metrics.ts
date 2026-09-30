import { getPreviousPeriod, type DateRange } from "@/lib/utils/date-range";
import type { Metric } from "@/types/metrics";
import { generateRevenueSeries } from "./generate-revenue-series";
import { generateTransactions } from "./generate-transactions";
import { generateUsersSeries } from "./generate-users-series";

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/**
 * Fraction change from `previous` to `current`. When the previous period was
 * zero there's no meaningful percentage — `Infinity` is a sentinel the UI
 * layer renders as "Novo" instead of a misleading number.
 */
function buildDelta(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : Number.POSITIVE_INFINITY;
  return (current - previous) / previous;
}

interface PeriodTotals {
  revenue: number;
  users: number;
  orders: number;
  conversionRate: number;
}

function computeTotals(range: DateRange): PeriodTotals {
  const revenueSeries = generateRevenueSeries(range);
  const usersSeries = generateUsersSeries(range);
  const transactions = generateTransactions(range);

  const revenue = sum(revenueSeries.points.map((point) => point.value));
  const users = sum(usersSeries.points.map((point) => point.newUsers));
  const orders = transactions.filter((transaction) => transaction.status !== "failed").length;
  // Checkout completion rate: of every transaction attempted, how many
  // actually completed. Deliberately derived from the transactions fixture
  // alone (not `orders / users`, which mixed two independently-scaled
  // datasets and produced implausible >50% "conversion" rates).
  const completed = transactions.filter((transaction) => transaction.status === "completed").length;
  const conversionRate = transactions.length === 0 ? 0 : completed / transactions.length;

  return { revenue, users, orders, conversionRate };
}

/**
 * Computes the 4 headline metrics for `range` alongside the equivalent
 * immediately-preceding window, so each card can show a "vs. previous
 * period" delta the way a real analytics product would.
 */
export function generateMetrics(range: DateRange): Metric[] {
  const revenueSeries = generateRevenueSeries(range);
  const usersSeries = generateUsersSeries(range);
  const transactions = generateTransactions(range);
  const previous = computeTotals(getPreviousPeriod(range));

  const revenue = sum(revenueSeries.points.map((point) => point.value));
  const users = sum(usersSeries.points.map((point) => point.newUsers));
  const orders = transactions.filter((transaction) => transaction.status !== "failed").length;
  const completed = transactions.filter((transaction) => transaction.status === "completed").length;
  const conversionRate = transactions.length === 0 ? 0 : completed / transactions.length;

  return [
    {
      key: "revenue",
      label: "Receita",
      value: revenue,
      previousValue: previous.revenue,
      deltaPercent: buildDelta(revenue, previous.revenue),
      format: "currency",
      sparkline: revenueSeries.points.slice(-14),
    },
    {
      key: "users",
      label: "Novos usuários",
      value: users,
      previousValue: previous.users,
      deltaPercent: buildDelta(users, previous.users),
      format: "number",
      sparkline: usersSeries.points
        .slice(-14)
        .map((point) => ({ date: point.date, value: point.activeUsers })),
    },
    {
      key: "orders",
      label: "Pedidos",
      value: orders,
      previousValue: previous.orders,
      deltaPercent: buildDelta(orders, previous.orders),
      format: "number",
    },
    {
      key: "conversionRate",
      label: "Taxa de conversão",
      value: conversionRate,
      previousValue: previous.conversionRate,
      deltaPercent: buildDelta(conversionRate, previous.conversionRate),
      format: "percent",
    },
  ];
}
