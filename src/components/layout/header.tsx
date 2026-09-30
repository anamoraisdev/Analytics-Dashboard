"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { CURRENT_USER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { PulseLogo } from "./pulse-logo";
import { SimulateErrorMenu } from "./simulate-error-menu";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

const NOTIFICATIONS = [
  { id: "n1", title: "Novo pico de receita", detail: "Receita 18% acima da média nas últimas 24h." },
  { id: "n2", title: "3 pagamentos falharam", detail: "Verifique a tabela de transações de hoje." },
  { id: "n3", title: "Relatório semanal pronto", detail: "O resumo de usuários está disponível." },
];

/**
 * Global top bar, shared by every route. The search box redirects to the
 * transactions page with `?q=`, which seeds that page's (otherwise
 * client-only) search box — see `app/transactions/page.tsx`.
 */
export function Header() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/transactions?q=${encodeURIComponent(trimmed)}` : "/transactions");
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        aria-label="Abrir navegação"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
      <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div className="flex items-center gap-2 lg:hidden">
        <PulseLogo />
        <span className="text-sm font-semibold">Pulse</span>
      </div>

      <form onSubmit={handleSearchSubmit} className="hidden flex-1 max-w-sm md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar transações, clientes…"
            className="pl-8"
            aria-label="Buscar"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Buscar"
          onClick={() => router.push("/transactions")}
        >
          <Search className="size-4" />
        </Button>

        <SimulateErrorMenu />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Notificações" />}
          >
            <Bell className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-72">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {NOTIFICATIONS.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium text-foreground">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.detail}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />

        <UserMenu user={CURRENT_USER} />
      </div>
    </header>
  );
}
