"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}
function getSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

/**
 * True once the component has hydrated on the client. Useful for values that
 * depend on client-only state (theme, localStorage) where the server render
 * must match a neutral placeholder to avoid a hydration mismatch.
 *
 * Implemented via `useSyncExternalStore` rather than `useState` + `useEffect`
 * — React re-checks the snapshot right after hydration on its own, so no
 * manual `setState` call (and no `react-hooks/set-state-in-effect` warning)
 * is needed.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
