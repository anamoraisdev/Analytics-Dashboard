import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TransactionStatus } from "@/types/transaction";
import { TransactionStatusBadge } from "./status-badge";

// Exhaustive by construction: if `TransactionStatus` gains a value that
// `STATUS_CONFIG` doesn't handle, the component file itself fails to
// type-check (it's a `Record<TransactionStatus, ...>`) — this test locks in
// the current label copy so a change there is deliberate, not accidental.
const EXPECTED_LABELS: Record<TransactionStatus, string> = {
  completed: "Concluído",
  pending: "Pendente",
  refunded: "Reembolsado",
  failed: "Falhou",
};

describe("TransactionStatusBadge", () => {
  for (const [status, label] of Object.entries(EXPECTED_LABELS) as [TransactionStatus, string][]) {
    it(`renders "${label}" for status "${status}"`, () => {
      render(<TransactionStatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  }
});
