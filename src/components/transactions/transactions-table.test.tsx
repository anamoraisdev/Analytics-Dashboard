import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Transaction } from "@/types/transaction";
import { TransactionsTable } from "./transactions-table";

// NOTE: the component renders a desktop `<table>` and a mobile card list
// side by side in the DOM (Tailwind hides one via `hidden`/`lg:hidden`
// classes — jsdom doesn't evaluate media queries, so both are always
// present). Assertions on per-row content are scoped with `within(table)`
// to avoid "multiple elements found" false failures; the toolbar, empty
// state and pagination only ever render once.

function buildTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: "txn",
    customer: { name: "Nome", email: "nome@example.com" },
    amount: 10_000,
    status: "completed",
    date: "2026-01-01",
    ...overrides,
  };
}

const TRANSACTIONS: Transaction[] = [
  buildTransaction({
    id: "1",
    customer: { name: "Ana Silva", email: "ana@example.com" },
    date: "2026-01-03",
    amount: 30_000,
  }),
  buildTransaction({
    id: "2",
    customer: { name: "Bruno Costa", email: "bruno@example.com" },
    date: "2026-01-01",
    amount: 10_000,
  }),
  buildTransaction({
    id: "3",
    customer: { name: "Carla Dias", email: "carla@example.com" },
    date: "2026-01-02",
    amount: 20_000,
    status: "failed",
  }),
];

describe("TransactionsTable", () => {
  it("renders every transaction by default", () => {
    render(<TransactionsTable transactions={TRANSACTIONS} />);
    const table = within(screen.getByRole("table"));
    expect(table.getByText("Ana Silva")).toBeInTheDocument();
    expect(table.getByText("Bruno Costa")).toBeInTheDocument();
    expect(table.getByText("Carla Dias")).toBeInTheDocument();
    expect(screen.getByText("3 transações")).toBeInTheDocument();
  });

  it("seeds the search box from initialQuery", () => {
    render(<TransactionsTable transactions={TRANSACTIONS} initialQuery="bruno" />);
    expect(screen.getByLabelText("Buscar transações")).toHaveValue("bruno");
  });

  it("filters by customer name", async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    await user.type(screen.getByLabelText("Buscar transações"), "bruno");

    expect(await screen.findByText("1 transação")).toBeInTheDocument();
    const table = within(screen.getByRole("table"));
    expect(table.getByText("Bruno Costa")).toBeInTheDocument();
    expect(table.queryByText("Ana Silva")).not.toBeInTheDocument();
  });

  it("filters by customer email too", async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    await user.type(screen.getByLabelText("Buscar transações"), "carla@example.com");

    expect(await screen.findByText("1 transação")).toBeInTheDocument();
  });

  it("shows an empty state for a search with no matches", async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    await user.type(screen.getByLabelText("Buscar transações"), "zzz-no-match");

    expect(await screen.findByText("Nenhuma transação encontrada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpar busca" })).toBeInTheDocument();
  });

  it('the empty state\'s "Limpar busca" action resets the search', async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    await user.type(screen.getByLabelText("Buscar transações"), "zzz-no-match");
    await screen.findByText("Nenhuma transação encontrada");

    await user.click(screen.getByRole("button", { name: "Limpar busca" }));

    const table = within(await screen.findByRole("table"));
    expect(table.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar transações")).toHaveValue("");
  });

  it("sorts by amount when the column header is clicked", async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    await user.click(screen.getByRole("button", { name: /ordenar por valor/i }));

    const table = within(screen.getByRole("table"));
    const dataRows = table.getAllByRole("row").slice(1); // skip the header row
    // First click on a new column defaults to descending: highest amount first.
    expect(within(dataRows[0]).getByText("Ana Silva")).toBeInTheDocument();
    expect(within(dataRows[2]).getByText("Bruno Costa")).toBeInTheDocument();
  });

  it("shows an empty state when there are no transactions at all", () => {
    render(<TransactionsTable transactions={[]} />);
    expect(screen.getByText("0 transações")).toBeInTheDocument();
    expect(screen.getByText("Não há transações neste período.")).toBeInTheDocument();
  });
});
