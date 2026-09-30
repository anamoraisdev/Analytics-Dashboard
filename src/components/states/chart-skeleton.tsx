import { CHART_HEIGHT_CLASS } from "@/lib/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Same height as the real chart container (`CHART_HEIGHT_CLASS`) — zero layout shift when data resolves. */
export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${CHART_HEIGHT_CLASS}`} />
      </CardContent>
    </Card>
  );
}
