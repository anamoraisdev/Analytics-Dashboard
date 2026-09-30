import { useEffect, useState } from "react";

/**
 * Delays reflecting `value` until it has stopped changing for `delayMs`.
 * Used for the transactions search box so filtering a few thousand rows
 * doesn't re-run on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // A genuine time-based synchronization (not derivable during render),
    // which is exactly what effects are for.
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
