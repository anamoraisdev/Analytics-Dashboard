"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  item: NavItem;
  /** Icon-only rendering for the collapsed desktop sidebar; the label moves into a tooltip. */
  collapsed?: boolean;
  /** Closes the mobile drawer after navigating. */
  onNavigate?: () => void;
}

const itemClassName = (isActive: boolean, collapsed: boolean | undefined, disabled: boolean) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    disabled
      ? "text-muted-foreground/60"
      : [
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70",
        ],
    collapsed && "justify-center px-0"
  );

/**
 * Isolated as its own component (rather than inlined in a `.map` inside
 * Sidebar) so that computing `isActive` from `usePathname()` only re-renders
 * the one item whose active state actually changed on navigation.
 */
export function SidebarNavItem({ item, collapsed, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;

  const label = !collapsed && (
    <>
      <span className="flex-1 truncate">{item.label}</span>
      {item.disabled && (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
          em breve
        </span>
      )}
    </>
  );

  if (item.disabled) {
    const content = (
      <div aria-disabled="true" className={itemClassName(false, collapsed, true)}>
        <Icon className="size-4.5 shrink-0" aria-hidden="true" />
        {label}
      </div>
    );

    if (!collapsed) return content;

    return (
      <Tooltip>
        <TooltipTrigger render={<div className={itemClassName(false, true, true)} />}>
          <Icon className="size-4.5 shrink-0" aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent side="right">{item.label} (em breve)</TooltipContent>
      </Tooltip>
    );
  }

  if (!collapsed) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={itemClassName(isActive, false, false)}
      >
        <Icon className="size-4.5 shrink-0" aria-hidden="true" />
        {label}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={itemClassName(isActive, true, false)}
          />
        }
      >
        <Icon className="size-4.5 shrink-0" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
