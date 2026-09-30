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
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
