// Barra de progreso del diagnóstico.
export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-soft"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Paso ${current} de ${total}`}
      >
        <div
          className="bg-gradient-brand h-full rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 font-mono text-xs text-ink-faint">
        {current}/{total}
      </span>
    </div>
  );
}
