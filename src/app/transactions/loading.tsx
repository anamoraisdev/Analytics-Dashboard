import { TableSkeleton } from "@/components/states/table-skeleton";

export default function TransactionsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="h-8" />
      <TableSkeleton />
    </div>
  );
}
