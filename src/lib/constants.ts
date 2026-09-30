import { LayoutDashboard, Receipt, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppUser } from "@/types/user";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Visão geral", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: Receipt },
  { href: "/settings", label: "Configurações", icon: Settings, disabled: true },
];

/**
 * Shared between the real chart containers and their loading skeletons so
 * the skeleton is pixel-for-pixel the same size as the chart it stands in
 * for — no layout shift when the data resolves.
 */
export const CHART_HEIGHT_CLASS = "h-56 sm:h-64 lg:h-80";

/** Stands in for an authenticated session — there's no real backend behind Pulse. */
export const CURRENT_USER: AppUser = {
  id: "user_1",
  name: "Marina Duarte",
  email: "marina@pulse.app",
  role: "Administradora",
};
