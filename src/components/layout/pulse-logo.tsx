import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The brand mark — a literal pulse: two rings expand and fade behind the
 * icon on a slow loop (`animate-ping`, staggered), like a heartbeat/radar
 * sweep. Purely decorative (`aria-hidden`); the accessible name comes from
 * the "Pulse" wordmark next to it.
 */
export function PulseLogo({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-5 shrink-0 items-center justify-center", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/40 [animation-duration:1.8s]" />
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-fun/30 [animation-delay:0.6s] [animation-duration:1.8s]" />
      <Activity className="relative size-5 text-brand" aria-hidden="true" />
    </span>
  );
}
