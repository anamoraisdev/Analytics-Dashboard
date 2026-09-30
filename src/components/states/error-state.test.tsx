import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "./error-state";

describe("ErrorState", () => {
  it("renders default copy when no props are given", () => {
    render(<ErrorState />);
    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
  });

  it("renders a custom title and description", () => {
    render(<ErrorState title="Falhou" description="Tente de novo." />);
    expect(screen.getByText("Falhou")).toBeInTheDocument();
    expect(screen.getByText("Tente de novo.")).toBeInTheDocument();
  });

  it("does not render a retry button when onRetry is not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
