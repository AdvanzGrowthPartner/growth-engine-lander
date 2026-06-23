import type { DiagnosticResult } from "@/types/diagnostic";
import { ScoreRing } from "@/components/diagnostic/ScoreRing";

const LEVEL_STYLES: Record<string, string> = {
  Crítico: "text-red-300",
  Intermedio: "text-amber-300",
  Avanzado: "text-cyan",
};

// Etapas que dependen de data interna → se profundizan en la llamada.
const LOCKED = new Set(["Retention", "Feedback", "Systems"]);

const SEG_COLOR: Record<string, string> = {
  Sano: "bg-emerald-400",
  Optimizable: "bg-amber-400",
  Urgente: "bg-red-400",
};

// Pantalla — Resultado: lectura rápida y visual del engine → agendar.
// El detalle profundo va en el Harubom por mail (no acá).
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
  const fmt = (n: number) => n.toLocaleString("es-CL");
  const visible = result.areas.filter((a) => !LOCKED.has(a.key));
  const urgent = visible
    .filter((a) => a.status === "Urgente")
    .sort((a, b) => a.score - b.score);

  return (
    <div className="text-center">
      {url && (
        <p className="font-mono text-xs text-ink-faint break-all">
          Resultado para <span className="text-ink-mute">{url}</span>
        </p>
      )}

      {/* Score + nivel */}
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

      {/* Engine snapshot — barra visual de 8 etapas */}
      <div className="mt-8 rounded-xl2 border border-hair bg-bg-card/50 p-5 text-left">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan">
          El estado de tu engine
        </p>
        <div className="flex gap-1.5">
          {result.areas.map((a) => (
            <div
              key={a.key}
              className={`h-2.5 flex-1 rounded-full ${
                LOCKED.has(a.key) ? "bg-ink-faint/25" : SEG_COLOR[a.status]
              }`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-faint">
          <span>🟢 Sano</span>
          <span>🟡 Optimizable</span>
          <span>🔴 Urgente</span>
          <span>🔒 En la llamada</span>
        </div>

        {urgent.length > 0 ? (
          <div className="mt-4 border-t border-hair/40 pt-4">
            <p className="mb-2 text-sm font-semibold text-ink">
              Tus fugas más urgentes:
            </p>
            <ul className="flex flex-col gap-2">
              {urgent.slice(0, 2).map((a) => (
                <li key={a.key} className="text-sm">
                  <span className="font-semibold text-red-300">{a.label}.</span>{" "}
                  <span className="text-ink-mute">{a.finding}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 border-t border-hair/40 pt-4 text-sm text-ink-mute">
            Tu base está sólida. El próximo nivel son ajustes finos — los vemos
            en la llamada.
          </p>
        )}
      </div>

      {/* Pérdida estimada — un solo número fuerte */}
      {result.loss && (
        <div className="mt-6 rounded-xl2 border border-red-400/30 bg-red-500/5 p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-red-300">
            Esto te puede estar costando
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
            US${fmt(result.loss.low)} – {fmt(result.loss.high)}
            <span className="text-lg font-semibold text-ink-mute"> / mes</span>
          </p>
        </div>
      )}

      {/* Anclaje de valor + CTA a la agenda */}
      <div className="glass mt-8 rounded-xl2 p-6 text-center sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          Diagnóstico completo · valor US$500
        </p>
        <p className="mt-2 text-sm text-ink-mute">
          Lo preparamos con tu data y te lo enviamos al mail al agendar. Vigencia{" "}
          <span className="font-semibold text-ink">48 horas</span>.
        </p>
        <button
          type="button"
          onClick={onBook}
          className="bg-gradient-brand mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-bg transition-transform duration-200 hover:scale-[1.02] active:scale-100"
        >
          Agendar mi sesión 1:1
        </button>
        <p className="mt-3 font-mono text-xs text-ink-faint">
          30 min · sin compromiso · salimos con un plan claro
        </p>
      </div>

      <p className="mt-5 font-mono text-xs text-ink-faint">
        📩 Agendes o no, tu informe llega a{" "}
        <span className="text-ink-mute break-all">{email || "tu email"}</span>
      </p>
    </div>
  );
}
