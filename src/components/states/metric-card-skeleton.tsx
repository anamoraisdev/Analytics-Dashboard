import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-8 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}

export function MetricCardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Fixed-length placeholder list — index as key is fine, it never reorders. */}
      {Array.from({ length: 4 }).map((_, index) => (
        <MetricCardSkeleton key={index} />
      ))}
    </div>
  );
}
