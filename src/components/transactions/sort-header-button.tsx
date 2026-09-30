"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { SortDirection } from "@/hooks/use-table-sort";

interface SortHeaderButtonProps<K extends string> {
  column: K;
  label: string;
  activeColumn: K;
  direction: SortDirection;
  onToggle: (column: K) => void;
}

export function SortHeaderButton<K extends string>({
  column,
  label,
  activeColumn,
  direction,
  onToggle,
}: SortHeaderButtonProps<K>) {
  const isActive = activeColumn === column;
  const Icon = !isActive ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onToggle(column)}
      className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
      aria-label={`Ordenar por ${label}`}
    >
      {label}
      <Icon className="size-3" aria-hidden="true" />
    </button>
  );
}
