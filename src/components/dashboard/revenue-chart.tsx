"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { CHART_HEIGHT_CLASS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatFullDate, formatShortDate } from "@/lib/utils/format-date";
import { formatCompactNumber } from "@/lib/utils/format-number";
import type { RevenueSeries } from "@/types/timeseries";

function RevenueTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length || typeof label !== "string") return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-foreground">{formatFullDate(label)}</p>
      <p className="text-series-1">{formatCurrency(Number(payload[0]?.value ?? 0))}</p>
    </div>
  );
}

export function RevenueChart({ series }: { series: RevenueSeries }) {
  return (
    <div className={CHART_HEIGHT_CLASS}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series.points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-series-1)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-series-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            minTickGap={32}
          />
          <YAxis
            tickFormatter={(value: number) => formatCompactNumber(value / 100)}
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
          />
          <Tooltip content={RevenueTooltip} cursor={{ stroke: "var(--color-border)" }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-series-1)"
            strokeWidth={2}
            fill="url(#revenue-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
