import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";
import { PeriodFilter } from "./period-filter";

describe("PeriodFilter", () => {
  it("updates the period search param when a preset is clicked", async () => {
    const onUrlUpdate = vi.fn();
    const user = userEvent.setup();
    render(<PeriodFilter />, {
      wrapper: withNuqsTestingAdapter({ searchParams: "?period=30d", onUrlUpdate }),
    });

    await user.click(screen.getByRole("button", { name: "7d" }));

    await waitFor(() => {
      const lastCall = onUrlUpdate.mock.calls.at(-1)?.[0];
      expect(lastCall?.searchParams.get("period")).toBe("7d");
    });
  });

  it("clears any custom from/to params when switching back to a preset", async () => {
    const onUrlUpdate = vi.fn();
    const user = userEvent.setup();
    render(<PeriodFilter />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?period=custom&from=2026-01-01&to=2026-01-10",
        onUrlUpdate,
      }),
    });

    // Deliberately not "30d": nuqs omits a param from the URL entirely when
    // it's set back to its declared default, so asserting against a
    // non-default preset keeps this test unambiguous.
    await user.click(screen.getByRole("button", { name: "90d" }));

    await waitFor(() => {
      const lastCall = onUrlUpdate.mock.calls.at(-1)?.[0];
      expect(lastCall?.searchParams.get("period")).toBe("90d");
      expect(lastCall?.searchParams.has("from")).toBe(false);
      expect(lastCall?.searchParams.has("to")).toBe(false);
    });
  });

  it('shows "Personalizado" when no custom range is set', () => {
    render(<PeriodFilter />, { wrapper: withNuqsTestingAdapter({ searchParams: "?period=30d" }) });
    expect(screen.getByText("Personalizado")).toBeInTheDocument();
  });

  it("shows the formatted range once a custom period is active", () => {
    render(<PeriodFilter />, {
      wrapper: withNuqsTestingAdapter({ searchParams: "?period=custom&from=2026-01-01&to=2026-01-10" }),
    });
    expect(screen.getByText("1 jan – 10 jan")).toBeInTheDocument();
  });
});
