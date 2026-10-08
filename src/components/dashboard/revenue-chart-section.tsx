import { TrendingUp } from "lucide-react";
import { getRevenueSeries } from "@/lib/api/get-revenue-series";
import type { DateRange, Period } from "@/lib/utils/date-range";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "./revenue-chart";

interface RevenueChartSectionProps {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function RevenueChartSection({ period, custom, forceError }: RevenueChartSectionProps) {
  const series = await getRevenueSeries({ period, custom, forceError });

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Receita</CardTitle>
          <CardDescription>
            {series.granularity === "week" ? "Total semanal" : "Total diário"} no período selecionado
          </CardDescription>
        </div>
        <CardAction>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
            <TrendingUp className="size-4 text-brand" aria-hidden="true" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <RevenueChart series={series} />
      </CardContent>
    </Card>
  );
}
