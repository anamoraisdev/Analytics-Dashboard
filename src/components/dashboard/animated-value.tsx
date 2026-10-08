"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatNumber } from "@/lib/utils/format-number";
import { formatRate } from "@/lib/utils/format-percent";

interface AnimatedValueProps {
  value: number;
  format: "currency" | "number" | "percent";
  durationMs?: number;
}

/** Keeps the value serializable across the server/client boundary — a function prop can't cross it. */
function formatDisplay(value: number, format: AnimatedValueProps["format"]): string {
  switch (format) {
    case "currency":
      return formatCurrency(Math.round(value));
    case "percent":
      return formatRate(value);
    case "number":
      return formatNumber(Math.round(value));
  }
}

/**
 * Counts up from 0 to `value` on mount (easeOutCubic), then just tracks
 * `value` directly. Skips the animation under `prefers-reduced-motion`, and
 * in environments without `matchMedia` (e.g. jsdom in tests).
 */
function shouldAnimate(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AnimatedValue({ value, format, durationMs = 900 }: AnimatedValueProps) {
  // Always starts at 0 (same on server and client) so hydration never mismatches —
  // `shouldAnimate()` can't gate the initial state itself, since it depends on
  // `window` and would otherwise disagree between the server render and the
  // client's first render.
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!shouldAnimate()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: jump straight to the final value for reduced-motion/no-matchMedia environments instead of animating.
      setDisplay(value);
      return;
    }

    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return <>{formatDisplay(display, format)}</>;
}
