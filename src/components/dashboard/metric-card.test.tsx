import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Metric } from "@/types/metrics";
import { MetricCard } from "./metric-card";

function buildMetric(overrides: Partial<Metric> = {}): Metric {
  return {
    key: "revenue",
    label: "Receita",
    value: 150_000,
    previousValue: 100_000,
    deltaPercent: 0.5,
    format: "currency",
    ...overrides,
  };
}

describe("MetricCard", () => {
  it("renders the label and the formatted value", () => {
    render(<MetricCard metric={buildMetric()} />);
    expect(screen.getByText("Receita")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?1\.500,00/)).toBeInTheDocument();
  });

  it("renders a positive delta with a leading +", () => {
    render(<MetricCard metric={buildMetric({ deltaPercent: 0.25 })} />);
    expect(screen.getByText("+25,0%")).toBeInTheDocument();
  });

  it("renders a negative delta with a leading -", () => {
    render(<MetricCard metric={buildMetric({ deltaPercent: -0.1 })} />);
    expect(screen.getByText("-10,0%")).toBeInTheDocument();
  });

  it('renders "Novo" instead of a percentage when the previous period was zero', () => {
    render(<MetricCard metric={buildMetric({ deltaPercent: Number.POSITIVE_INFINITY })} />);
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });

  it("formats a percent-type metric without a currency symbol", () => {
    render(
      <MetricCard
        metric={buildMetric({
          key: "conversionRate",
          label: "Taxa de conversão",
          format: "percent",
          value: 0.042,
          deltaPercent: 0,
        })}
      />
    );
    expect(screen.getByText("4,2%")).toBeInTheDocument();
  });

  it("renders a plain count for a number-type metric", () => {
    render(
      <MetricCard
        metric={buildMetric({ key: "orders", label: "Pedidos", format: "number", value: 1234, deltaPercent: 0 })}
      />
    );
    expect(screen.getByText("1.234")).toBeInTheDocument();
  });
});
