"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorState } from "./error-state";

interface DashboardErrorBoundaryProps {
  children: ReactNode;
  /** Used in the fallback message, e.g. "as métricas", "o gráfico de receita". */
  sectionLabel: string;
}

/**
 * Scopes error recovery to a single dashboard section instead of the whole
 * page. `onReset` calls `router.refresh()` to re-run the Server Component
 * subtree — re-fetching from the fake API — rather than trying to recover
 * client-side state that was never the source of the error.
 */
export function DashboardErrorBoundary({ children, sectionLabel }: DashboardErrorBoundaryProps) {
  const router = useRouter();

  return (
    <ErrorBoundary
      onReset={() => router.refresh()}
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorState title={`Não foi possível carregar ${sectionLabel}`} onRetry={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
