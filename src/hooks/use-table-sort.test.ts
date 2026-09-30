import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTableSort } from "./use-table-sort";

interface Row {
  name: string;
  amount: number;
}

const DATA: Row[] = [
  { name: "Carla", amount: 300 },
  { name: "Ana", amount: 100 },
  { name: "Bruno", amount: 200 },
];

function getValue(row: Row, key: "name" | "amount") {
  return row[key];
}

describe("useTableSort", () => {
  it("sorts by the initial key/direction", () => {
    const { result } = renderHook(() =>
      useTableSort<Row, "name" | "amount">({ data: DATA, getValue, initialKey: "amount", initialDirection: "asc" })
    );
    expect(result.current.sorted.map((row) => row.amount)).toEqual([100, 200, 300]);
  });

  it("toggling the same column flips direction", () => {
    const { result } = renderHook(() =>
      useTableSort<Row, "name" | "amount">({ data: DATA, getValue, initialKey: "amount", initialDirection: "asc" })
    );

    act(() => result.current.toggleSort("amount"));
    expect(result.current.direction).toBe("desc");
    expect(result.current.sorted.map((row) => row.amount)).toEqual([300, 200, 100]);

    act(() => result.current.toggleSort("amount"));
    expect(result.current.direction).toBe("asc");
  });

  it("switching to a different column resets direction to desc", () => {
    const { result } = renderHook(() =>
      useTableSort<Row, "name" | "amount">({ data: DATA, getValue, initialKey: "amount", initialDirection: "asc" })
    );

    act(() => result.current.toggleSort("name"));
    expect(result.current.sortKey).toBe("name");
    expect(result.current.direction).toBe("desc");
    expect(result.current.sorted.map((row) => row.name)).toEqual(["Carla", "Bruno", "Ana"]);
  });

  it("does not mutate the original data array", () => {
    const original = [...DATA];
    renderHook(() => useTableSort<Row, "name" | "amount">({ data: DATA, getValue, initialKey: "amount" }));
    expect(DATA).toEqual(original);
  });
});
