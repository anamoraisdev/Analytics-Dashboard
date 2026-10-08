import { DollarSign, Percent, ShoppingCart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MetricKey } from "@/types/metrics";

export const METRIC_ICONS: Record<MetricKey, LucideIcon> = {
  revenue: DollarSign,
  users: Users,
  orders: ShoppingCart,
  conversionRate: Percent,
};

/** One distinct accent color per metric, so the grid reads as a set of signals rather than four identical cards. */
export const METRIC_ACCENTS: Record<MetricKey, string> = {
  revenue: "var(--color-brand)",
  users: "var(--color-accent-fun)",
  orders: "var(--color-series-2)",
  conversionRate: "var(--color-status-good)",
};
