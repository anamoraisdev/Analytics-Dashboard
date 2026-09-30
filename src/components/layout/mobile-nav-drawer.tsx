"use client";

import { NAV_ITEMS } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PulseLogo } from "./pulse-logo";
import { SidebarNavItem } from "./sidebar-nav-item";

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** The sidebar's off-canvas equivalent for tablet/mobile, triggered from the Header. */
export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72">
        <SheetHeader className="flex-row items-center gap-2 border-b border-border">
          <PulseLogo />
          <SheetTitle>Pulse</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.href} item={item} onNavigate={() => onOpenChange(false)} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
