/** Small "data is live" cue — pure CSS animation, no client JS needed. */
export function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-status-good/10 px-2 py-0.5 text-xs font-medium text-status-good">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-good opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-status-good" />
      </span>
      Dados ao vivo
    </span>
  );
}
