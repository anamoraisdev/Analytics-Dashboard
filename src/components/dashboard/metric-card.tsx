import type { CSSProperties } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { Metric } from "@/types/metrics";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/format-percent";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedValue } from "./animated-value";
import { METRIC_ACCENTS, METRIC_ICONS } from "./metric-icons";
import { Sparkline } from "./sparkline";

export function MetricCard({ metric, index = 0 }: { metric: Metric; index?: number }) {
  const Icon = METRIC_ICONS[metric.key];
  const accent = METRIC_ACCENTS[metric.key];
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

  const style = {
    "--metric-accent": accent,
    animationDelay: `${index * 80}ms`,
  } as CSSProperties;

  return (
    <Card
      style={style}
      className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_var(--metric-accent)]"
    >
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-text-secondary">{metric.label}</CardTitle>
        <CardAction>
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklch, ${accent}, transparent 78%), color-mix(in oklch, ${accent}, transparent 94%))`,
            }}
          >
            <Icon className="size-4" style={{ color: accent }} aria-hidden="true" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            <AnimatedValue value={metric.value} format={metric.format} />
          </p>
          {metric.sparkline && metric.sparkline.length > 1 && (
            <Sparkline data={metric.sparkline} color={accent} className="h-8 w-20 shrink-0" />
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
