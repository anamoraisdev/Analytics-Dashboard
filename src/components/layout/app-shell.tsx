import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

/**
 * Root visual shell shared by every route: fixed sidebar (desktop) + header,
 * with the page content scrolling independently in `<main>`. Stays a Server
 * Component — the interactive pieces (Sidebar, Header) are Client Components
 * nested inside it, so this wrapper itself ships no extra JS.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="relative flex-1 overflow-y-auto">
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 opacity-60 dark:opacity-40"
            style={{
              background:
                "radial-gradient(600px circle at 15% 0%, color-mix(in oklch, var(--color-brand), transparent 88%), transparent 60%), radial-gradient(500px circle at 100% 20%, color-mix(in oklch, var(--color-accent-fun), transparent 90%), transparent 60%)",
            }}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
