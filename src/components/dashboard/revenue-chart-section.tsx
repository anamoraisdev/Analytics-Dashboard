import { getRevenueSeries } from "@/lib/api/get-revenue-series";
import type { DateRange, Period } from "@/lib/utils/date-range";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "./revenue-chart";

interface RevenueChartSectionProps {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function RevenueChartSection({ period, custom, forceError }: RevenueChartSectionProps) {
  const series = await getRevenueSeries({ period, custom, forceError });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita</CardTitle>
        <CardDescription>
          {series.granularity === "week" ? "Total semanal" : "Total diário"} no período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RevenueChart series={series} />
      </CardContent>
    </Card>
  );
}
