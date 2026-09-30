import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/transactions",
}));

describe("Sidebar", () => {
  it("marks the current route's nav item as active", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: "Transações" })).toHaveAttribute("aria-current", "page");
  });

  it("does not mark other routes as active", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: "Visão geral" })).not.toHaveAttribute("aria-current");
  });

  it("renders the disabled item as non-interactive, with an 'em breve' badge", () => {
    render(<Sidebar />);
    expect(screen.getByText("em breve")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /configurações/i })).not.toBeInTheDocument();
  });
});
