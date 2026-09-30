import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatShortDate(dateISO: string): string {
  return format(parseISO(dateISO), "d MMM", { locale: ptBR });
}

export function formatFullDate(dateISO: string): string {
  return format(parseISO(dateISO), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDateTime(dateISO: string): string {
  return format(parseISO(dateISO), "d MMM yyyy, HH:mm", { locale: ptBR });
}
