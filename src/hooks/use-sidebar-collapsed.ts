"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "pulse:sidebar-collapsed";

const listeners = new Set<() => void>();
let cached = false;

function emitChange() {
  for (const listener of listeners) listener();
}

if (typeof window !== "undefined") {
  cached = window.localStorage.getItem(STORAGE_KEY) === "true";
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      cached = event.newValue === "true";
      emitChange();
    }
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return cached;
}

function getServerSnapshot() {
  return false; // sidebar starts expanded during SSR/hydration
}

/**
 * Tiny external store (via `useSyncExternalStore`) for the sidebar's
 * collapse preference. It's a local UI preference, not shareable state, so
 * it lives in localStorage rather than the URL — unlike the period filter.
 * Reading/writing through a real store (instead of `useState` + an
 * effect that syncs to localStorage) keeps every consumer in sync without
 * a `setState`-in-effect render cascade.
 */
export function useSidebarCollapsed(): [boolean, (value: boolean) => void] {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCollapsed = useCallback((value: boolean) => {
    cached = value;
    window.localStorage.setItem(STORAGE_KEY, String(value));
    emitChange();
  }, []);

  return [collapsed, setCollapsed];
}
