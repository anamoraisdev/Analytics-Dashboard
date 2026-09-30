import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

interface UseTableSortOptions<T, K extends string> {
  data: T[];
  getValue: (item: T, key: K) => string | number;
  initialKey: K;
  initialDirection?: SortDirection;
}

/** Generic, column-agnostic sort: pass a `getValue` accessor and a sortable column key. */
export function useTableSort<T, K extends string>({
  data,
  getValue,
  initialKey,
  initialDirection = "desc",
}: UseTableSortOptions<T, K>) {
  const [sortKey, setSortKey] = useState<K>(initialKey);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const valueA = getValue(a, sortKey);
      const valueB = getValue(b, sortKey);
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return direction === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [data, sortKey, direction, getValue]);

  function toggleSort(key: K) {
    if (key === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("desc");
    }
  }

  return { sorted, sortKey, direction, toggleSort };
}
