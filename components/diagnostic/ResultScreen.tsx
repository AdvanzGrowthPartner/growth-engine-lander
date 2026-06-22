import type { DiagnosticResult } from "@/types/diagnostic";
import { ScoreRing } from "@/components/diagnostic/ScoreRing";

const LEVEL_STYLES: Record<string, string> = {
  Crítico: "text-red-300",
  Intermedio: "text-amber-300",
  Avanzado: "text-cyan",
};

// Pantalla 9 — Resultado: el ajá moment.
export function ResultScreen({
  result,
  url,
  email,
  onBook,
}: {
  result: DiagnosticResult;
  url: string;
  email: string;
  onBook: () => void;
}) {
  return (
    <div className="text-center">
      {url && (
        <p className="font-mono text-xs text-ink-faint break-all">
          Resultado para <span className="text-ink-mute">{url}</span>
        </p>
      )}

      <div className="mt-4">
        <ScoreRing score={result.score} />
      </div>

      <p
        className={`mt-4 font-mono text-sm uppercase tracking-[0.2em] ${
          LEVEL_STYLES[result.level] ?? "text-ink"
        }`}
      >
        Nivel {result.level}
      </p>
      <p className="mx-auto mt-3 max-w-md text-pretty text-ink-mute">
        {result.levelText}
      </p>

      {/* Los 3 gaps más débiles */}
      <div className="mt-8 text-left">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">
          Tus 3 fugas más urgentes
        </p>
        <div className="flex flex-col gap-3">
          {result.gaps.map((gap, i) => (
            <div
              key={gap.stage}
              className="rounded-xl2 border border-hair bg-bg-card/50 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-gradient">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-ink">{gap.label}</span>
              </div>
              <p className="mt-1.5 text-sm text-ink-mute">{gap.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA con bonus */}
      <div className="glass mt-8 rounded-xl2 p-6 text-center">
        <p className="text-sm font-semibold text-ink">
          🎁 Dashboard valorado en $500 por agendar
        </p>
        <button
          type="button"
          onClick={onBook}
          className="bg-gradient-brand mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-bg transition-transform duration-200 hover:scale-[1.02] active:scale-100"
        >
          Agendar mi auditoría gratuita
        </button>
      </div>

      <p className="mt-5 font-mono text-xs text-ink-faint">
        📩 Tu informe completo va a{" "}
        <span className="text-ink-mute break-all">
          {email || "tu email"}
        </span>
      </p>
    </div>
  );
}
