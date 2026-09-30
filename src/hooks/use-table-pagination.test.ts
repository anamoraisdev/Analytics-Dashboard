import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTablePagination } from "./use-table-pagination";

const ITEMS = Array.from({ length: 25 }, (_, index) => index);

describe("useTablePagination", () => {
  it("slices the first page by default", () => {
    const { result } = renderHook(() => useTablePagination(ITEMS, 10));
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageItems).toEqual(ITEMS.slice(0, 10));
  });

  it("goToPage moves to the requested page", () => {
    const { result } = renderHook(() => useTablePagination(ITEMS, 10));
    act(() => result.current.goToPage(2));
    expect(result.current.page).toBe(2);
    expect(result.current.pageItems).toEqual(ITEMS.slice(10, 20));
  });

  it("clamps goToPage within [1, totalPages]", () => {
    const { result } = renderHook(() => useTablePagination(ITEMS, 10));
    act(() => result.current.goToPage(999));
    expect(result.current.page).toBe(3);
    act(() => result.current.goToPage(-5));
    expect(result.current.page).toBe(1);
  });

  it("self-corrects when the filtered item list shrinks below the current page", () => {
    const { result, rerender } = renderHook(({ items }) => useTablePagination(items, 10), {
      initialProps: { items: ITEMS },
    });

    act(() => result.current.goToPage(3));
    expect(result.current.page).toBe(3);

    // Simulate a search narrowing the results to a single page's worth.
    rerender({ items: ITEMS.slice(0, 5) });
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it("always reports at least 1 total page, even when empty", () => {
    const { result } = renderHook(() => useTablePagination([], 10));
    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageItems).toEqual([]);
  });
});
