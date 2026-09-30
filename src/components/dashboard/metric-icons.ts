import { DollarSign, Percent, ShoppingCart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MetricKey } from "@/types/metrics";

export const METRIC_ICONS: Record<MetricKey, LucideIcon> = {
  revenue: DollarSign,
  users: Users,
  orders: ShoppingCart,
  conversionRate: Percent,
};
