"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { CHART_HEIGHT_CLASS } from "@/lib/constants";
import { formatShortDate } from "@/lib/utils/format-date";
import { formatCompactNumber, formatNumber } from "@/lib/utils/format-number";
import type { UsersSeries } from "@/types/timeseries";

function UsersTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length || typeof label !== "string") return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1.5 font-medium text-foreground">{formatShortDate(label)}</p>
      {payload.map((entry) => (
        <p key={String(entry.dataKey ?? entry.name)} className="flex items-center gap-1.5" style={{ color: entry.color }}>
          <span>{entry.name}:</span>
          <span className="tabular-nums">{formatNumber(Number(entry.value ?? 0))}</span>
        </p>
      ))}
    </div>
  );
}

export function UsersChart({ series }: { series: UsersSeries }) {
  return (
    <div className={CHART_HEIGHT_CLASS}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series.points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            tickFormatter={formatCompactNumber}
            tickLine={false}
            axisLine={false}
            width={40}
            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
          />
          <Tooltip content={UsersTooltip} cursor={{ fill: "var(--color-muted)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "var(--color-text-secondary)" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="newUsers" name="Novos" fill="var(--color-series-2)" radius={[3, 3, 0, 0]} maxBarSize={24} />
          <Line
            type="monotone"
            dataKey="activeUsers"
            name="Ativos"
            stroke="var(--color-series-1)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
