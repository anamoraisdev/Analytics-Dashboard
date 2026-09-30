"use client";

import { AlertTriangle, Check } from "lucide-react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const FAIL_KEYS = ["metrics", "revenue", "users", "transactions", "all"] as const;
export type FailKey = (typeof FAIL_KEYS)[number];

const LABELS: Record<FailKey, string> = {
  metrics: "Cards de métricas",
  revenue: "Gráfico de receita",
  users: "Gráfico de usuários",
  transactions: "Tabela de transações",
  all: "Todas as seções",
};

/**
 * Dev/demo control: forces the next fetch of a given dashboard section to
 * reject (via the `?__fail=` search param, read by the fake API layer), so
 * the error state + retry flow can be shown on demand instead of needing
 * devtools or network throttling to reach it.
 */
export function SimulateErrorMenu() {
  // shallow: false — this must reach the server (it flips a prop a Server
  // Component reads), so the default shallow/client-only URL update won't do.
  const [fail, setFail] = useQueryState("__fail", parseAsStringLiteral(FAIL_KEYS).withOptions({ shallow: false }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={fail ? "destructive" : "ghost"}
            size="icon-sm"
            aria-label="Simular erro"
          />
        }
      >
        <AlertTriangle className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Simular erro (demo)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {FAIL_KEYS.map((key) => (
            <DropdownMenuItem key={key} onClick={() => setFail(fail === key ? null : key)}>
              <span className="flex-1">{LABELS[key]}</span>
              {fail === key && <Check className="size-3.5" />}
            </DropdownMenuItem>
          ))}
          {fail && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFail(null)}>Limpar</DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
