"use client";

import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransactionsToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
  onExport: () => void;
}

export function TransactionsToolbar({ query, onQueryChange, resultCount, onExport }: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por cliente ou e-mail…"
          className="pl-8"
          aria-label="Buscar transações"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? "transação" : "transações"}
        </span>
        <Button variant="outline" size="sm" onClick={onExport} disabled={resultCount === 0}>
          <Download className="size-3.5" />
          Exportar CSV
        </Button>
      </div>
    </div>
  );
}
