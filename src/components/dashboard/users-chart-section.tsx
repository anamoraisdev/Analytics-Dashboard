import { getUsersSeries } from "@/lib/api/get-users-series";
import type { DateRange, Period } from "@/lib/utils/date-range";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersChart } from "./users-chart";

interface UsersChartSectionProps {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function UsersChartSection({ period, custom, forceError }: UsersChartSectionProps) {
  const series = await getUsersSeries({ period, custom, forceError });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários</CardTitle>
        <CardDescription>Novos vs. ativos por dia no período selecionado</CardDescription>
      </CardHeader>
      <CardContent>
        <UsersChart series={series} />
      </CardContent>
    </Card>
  );
}
