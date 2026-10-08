import { Users as UsersIcon } from "lucide-react";
import { getUsersSeries } from "@/lib/api/get-users-series";
import type { DateRange, Period } from "@/lib/utils/date-range";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersChart } from "./users-chart";

interface UsersChartSectionProps {
  period: Period;
  custom?: Partial<DateRange>;
  forceError?: boolean;
}

export async function UsersChartSection({ period, custom, forceError }: UsersChartSectionProps) {
  const series = await getUsersSeries({ period, custom, forceError });

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 delay-100">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Novos vs. ativos por dia no período selecionado</CardDescription>
        </div>
        <CardAction>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-fun/10">
            <UsersIcon className="size-4 text-accent-fun" aria-hidden="true" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <UsersChart series={series} />
      </CardContent>
    </Card>
  );
}
