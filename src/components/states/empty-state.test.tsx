import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(<EmptyState icon={Inbox} title="Nada por aqui" description="Tente outro filtro." />);
    expect(screen.getByText("Nada por aqui")).toBeInTheDocument();
    expect(screen.getByText("Tente outro filtro.")).toBeInTheDocument();
  });

  it("omits the description paragraph when none is provided", () => {
    render(<EmptyState icon={Inbox} title="Nada por aqui" />);
    expect(screen.queryByText("Tente outro filtro.")).not.toBeInTheDocument();
  });

  it("renders the caller-provided action", () => {
    render(<EmptyState icon={Inbox} title="Nada por aqui" action={<button>Limpar</button>} />);
    expect(screen.getByRole("button", { name: "Limpar" })).toBeInTheDocument();
  });
});
