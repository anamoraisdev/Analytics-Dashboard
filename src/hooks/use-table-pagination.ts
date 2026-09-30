import { useMemo, useState } from "react";

/**
 * `page` is clamped against the current `totalPages` on every render (not
 * just reset via an effect), so it self-corrects the instant a search or
 * filter shrinks the result set — no stale "page 4 of 2" state possible.
 */
export function useTablePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  function goToPage(next: number) {
    setPage(Math.min(Math.max(1, next), totalPages));
  }

  return { pageItems, page: safePage, totalPages, goToPage };
}
