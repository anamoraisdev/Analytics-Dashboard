"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { Button } from "@/components/ui/button";
import { PulseLogo } from "./pulse-logo";
import { SidebarNavItem } from "./sidebar-nav-item";

/**
 * Fixed desktop navigation panel. Collapse state is purely a local UI
 * preference (not shareable, doesn't affect data), so it's kept in
 * localStorage rather than the URL — unlike the period filter.
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex h-14 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}>
        <PulseLogo />
        {!collapsed && <span className="ml-2 text-sm font-semibold tracking-tight">Pulse</span>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size={collapsed ? "icon-sm" : "sm"}
          className={cn("w-full", !collapsed && "justify-start gap-2")}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && "Recolher"}
        </Button>
      </div>
    </aside>
  );
}
