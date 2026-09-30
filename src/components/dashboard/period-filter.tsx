"use client";

import { useState, useTransition } from "react";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { DateRange as CalendarRange } from "react-day-picker";
import { CalendarDays, Loader2 } from "lucide-react";
import { PERIOD_OPTIONS, type Period } from "@/lib/utils/date-range";
import { formatShortDate } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PERIOD_VALUES = PERIOD_OPTIONS.map((option) => option.value);
const PRESET_OPTIONS = PERIOD_OPTIONS.filter((option) => option.value !== "custom");

/**
 * Drives the dashboard's date range through the URL (`?period=`, `&from=`,
 * `&to=`) rather than component state — see the architecture note in
 * `app/page.tsx`. `shallow: false` is required here: nuqs defaults to
 * shallow (client-only) URL updates, which never ask Next.js to re-fetch the
 * Server Components below — without it, the URL changes but the page
 * silently keeps showing stale data. `startTransition` lets the buttons show
 * a pending state while the new data streams in.
 */
export function PeriodFilter() {
  const [isPending, startTransition] = useTransition();
  const [{ period, from, to }, setQuery] = useQueryStates(
    {
      period: parseAsStringLiteral(PERIOD_VALUES).withDefault("30d"),
      from: parseAsString,
      to: parseAsString,
    },
    { shallow: false, startTransition }
  );

  const [pendingRange, setPendingRange] = useState<CalendarRange | undefined>(
    from && to ? { from: new Date(from), to: new Date(to) } : undefined
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  function selectPreset(value: Period) {
    setQuery({ period: value, from: null, to: null });
  }

  function applyCustomRange() {
    if (!pendingRange?.from || !pendingRange?.to) return;
    setQuery({
      period: "custom",
      from: toISODate(pendingRange.from),
      to: toISODate(pendingRange.to),
    });
    setCalendarOpen(false);
  }

  const customLabel =
    period === "custom" && from && to
      ? `${formatShortDate(from)} – ${formatShortDate(to)}`
      : "Personalizado";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 transition-opacity",
        isPending && "opacity-60"
      )}
    >
      {PRESET_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={period === option.value ? "secondary" : "ghost"}
          size="sm"
          disabled={isPending}
          onClick={() => selectPreset(option.value)}
        >
          {option.value}
        </Button>
      ))}

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger
          render={
            <Button
              variant={period === "custom" ? "secondary" : "ghost"}
              size="sm"
              disabled={isPending}
              className={cn("gap-1.5", period === "custom" && "pr-2.5")}
            />
          }
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <CalendarDays className="size-3.5" />
          )}
          {customLabel}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={pendingRange}
            onSelect={setPendingRange}
            numberOfMonths={2}
            defaultMonth={pendingRange?.from ?? new Date()}
          />
          <div className="flex items-center justify-end gap-2 border-t border-border p-2.5">
            <Button variant="ghost" size="sm" onClick={() => setCalendarOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" disabled={!pendingRange?.from || !pendingRange?.to} onClick={applyCustomRange}>
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
