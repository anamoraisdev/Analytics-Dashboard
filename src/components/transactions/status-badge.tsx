import { CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TransactionStatus } from "@/types/transaction";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<TransactionStatus, { label: string; icon: LucideIcon; className: string }> = {
  completed: {
    label: "Concluído",
    icon: CheckCircle2,
    className: "border-status-good/20 bg-status-good/10 text-status-good",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "border-status-warning/20 bg-status-warning/10 text-status-warning",
  },
  refunded: {
    label: "Reembolsado",
    icon: RotateCcw,
    className: "border-status-serious/20 bg-status-serious/10 text-status-serious",
  },
  failed: {
    label: "Falhou",
    icon: XCircle,
    className: "border-status-critical/20 bg-status-critical/10 text-status-critical",
  },
};

/** Status is always icon + label, never color alone — readable without relying on color perception. */
export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <Icon className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}
