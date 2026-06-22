import type { DiagnosticResult } from "@/types/diagnostic";
import { MAX_SCORE } from "@/lib/scoring";
import { ScoreRing } from "@/components/diagnostic/ScoreRing";

const LEVEL_STYLES: Record<string, string> = {
  Crítico: "text-red-300",
  Intermedio: "text-amber-300",
  Avanzado: "text-cyan",
};

// Lo que se llevan si agendan (stack de valor).
const VALUE_STACK = [
  "Informe completo de tu Growth Score por mail",
  "El plan exacto para tus 3 fugas principales",
  "Dashboard de métricas valorado en $500",
  "Roadmap priorizado para tu etapa de negocio",
];

// Pantalla 9 — Resultado: el ajá moment, estructurado para que quieran agendar.
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

  return (
    <div className="text-center">
      {url && (
        <p className="font-mono text-xs text-ink-faint break-all">
          Resultado para <span className="text-ink-mute">{url}</span>
        </p>
      )}

      {/* BLOQUE 1 — Score + veredicto */}
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

      {/* BLOQUE "wow" — esto detectamos en tu tienda */}
      {result.analyzed && result.detected.length > 0 && (
        <div className="mt-6 rounded-xl2 border border-hair bg-bg-card/50 p-5 text-left">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan">
            Analizamos tu tienda · esto encontramos
          </p>
          <div className="flex flex-wrap gap-2">
            {result.detected.map((d) => (
              <span
                key={d}
                className="rounded-full border border-hair bg-bg-soft px-3 py-1 font-mono text-xs text-ink-mute"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* BLOQUE 2 — Lo que te está costando */}
      {result.loss && (
        <div className="mt-6 rounded-xl2 border border-red-400/30 bg-red-500/5 p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-red-300">
            Esto te puede estar costando
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
            US${fmt(result.loss.low)} – {fmt(result.loss.high)}
            <span className="text-lg font-semibold text-ink-mute"> / mes</span>
          </p>
          <p className="mt-2 text-sm text-ink-mute">
            Estimado según tu facturación y las fugas detectadas. Cada mes que
            sigue, se acumula.
          </p>
        </div>
      )}

      {/* BLOQUE 3 — Las 3 fugas (con curiosity gap) */}
      <div className="mt-8 text-left">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">
          Tus 3 fugas más urgentes
        </p>
        <div className="flex flex-col gap-3">
          {result.gaps.map((gap, i) => (
            <div
              key={gap.key}
              className="rounded-xl2 border border-hair bg-bg-card/50 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-gradient">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-ink">{gap.label}</span>
                {gap.detected && (
                  <span className="rounded-full bg-cyan/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan">
                    detectado
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-ink-mute">{gap.finding}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-faint">
          El plan exacto para destrabar cada una te lo mostramos en la auditoría.
        </p>
      </div>

      {/* BLOQUE 4 — Benchmark vs. pares */}
      <div className="mt-8 rounded-xl2 border border-hair bg-bg-card/50 p-5 text-left">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
          Cómo estás vs. otras tiendas
        </p>
        <BenchBar label="Tu tienda" value={result.benchmark.you} accent />
        <div className="h-3" />
        <BenchBar
          label="Ordenaron su Growth Engine"
          value={result.benchmark.peers}
        />
        <p className="mt-3 font-mono text-[11px] text-ink-faint">
          * Promedio de referencia (estimado).
        </p>
      </div>

      {/* BLOQUE 5 + 6 — Stack de valor + CTA con urgencia */}
      <div className="glass mt-8 rounded-xl2 p-6 text-left">
        <p className="text-center text-sm font-semibold text-ink">
          🎁 Si agendás tu auditoría gratuita te llevás:
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {VALUE_STACK.map((v) => (
            <li key={v} className="flex items-start gap-2 text-sm text-ink-mute">
              <svg
                viewBox="0 0 20 20"
                className="mt-0.5 h-4 w-4 shrink-0 text-cyan"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {v}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onBook}
          className="bg-gradient-brand mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-bg transition-transform duration-200 hover:scale-[1.02] active:scale-100"
        >
          Agendar mi auditoría gratuita
        </button>
        <p className="mt-3 text-center font-mono text-xs text-ink-faint">
          Cupos limitados por semana · sin costo · sin compromiso
        </p>
      </div>

      <p className="mt-5 font-mono text-xs text-ink-faint">
        📩 Tu informe completo va a{" "}
        <span className="text-ink-mute break-all">{email || "tu email"}</span>
      </p>
    </div>
  );
}

function BenchBar({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  const pct = Math.max(4, Math.min(100, (value / MAX_SCORE) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-ink-mute">{label}</span>
        <span className="font-mono text-ink">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-bg-soft">
        <div
          className={`h-full rounded-full ${
            accent ? "bg-gradient-brand" : "bg-ink-faint/50"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
