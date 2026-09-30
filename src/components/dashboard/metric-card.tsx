import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { Metric } from "@/types/metrics";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatNumber } from "@/lib/utils/format-number";
import { formatPercent, formatRate } from "@/lib/utils/format-percent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { METRIC_ICONS } from "./metric-icons";
import { Sparkline } from "./sparkline";

function formatMetricValue(metric: Metric): string {
  switch (metric.format) {
    case "currency":
      return formatCurrency(metric.value);
    case "percent":
      return formatRate(metric.value);
    case "number":
      return formatNumber(metric.value);
  }
}

export function MetricCard({ metric }: { metric: Metric }) {
  const Icon = METRIC_ICONS[metric.key];
  const isNew = !Number.isFinite(metric.deltaPercent);
  const isFlat = metric.deltaPercent === 0;
  const isPositive = metric.deltaPercent > 0;

  const DeltaIcon = isNew || isFlat ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;
  const deltaTone =
    isNew || isFlat
      ? "text-text-muted"
      : isPositive
        ? "text-status-good"
        : "text-status-critical";

  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-text-secondary">{metric.label}</CardTitle>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand/15 to-accent-fun/15">
          <Icon className="size-4 text-brand" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {formatMetricValue(metric)}
          </p>
          {metric.sparkline && metric.sparkline.length > 1 && (
            <Sparkline data={metric.sparkline} className="h-8 w-20 shrink-0" />
          )}
        </div>
        <div className={cn("flex flex-wrap items-center gap-1 text-xs font-medium", deltaTone)}>
          <DeltaIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{isNew ? "Novo" : formatPercent(metric.deltaPercent)}</span>
          <span className="font-normal text-muted-foreground">vs. período anterior</span>
        </div>
      </CardContent>
    </Card>
  );
}
