import type { AreaResult, DiagnosticResult } from "@/types/diagnostic";
import { ScoreRing } from "@/components/diagnostic/ScoreRing";

const LEVEL_STYLES: Record<string, string> = {
  Crítico: "text-red-300",
  Intermedio: "text-amber-300",
  Avanzado: "text-cyan",
};

// Etapas que dependen de data interna → se profundizan en la llamada (estilo Harubom).
const LOCKED = new Set(["Retention", "Feedback", "Systems"]);

// Pantalla 9 — Resultado: estado del engine + anclaje de valor → agendar.
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

      {/* Estado del engine — 8 etapas con badge */}
      <div className="mt-8 rounded-xl2 border border-hair bg-bg-card/50 p-5 text-left">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-cyan">
          El estado de tu engine
        </p>
        <p className="mb-3 text-xs text-ink-faint">
          Esto es lo que detectamos desde fuera, en tus 8 etapas.
        </p>
        <div>
          {result.areas.map((a, i) => (
            <StageRow key={a.key} area={a} index={i} />
          ))}
        </div>
      </div>

      {/* Pérdida estimada */}
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
            Estimado según tu facturación y las fugas detectadas.
          </p>
        </div>
      )}

      {/* Anclaje de valor + CTA */}
      <div className="glass mt-8 rounded-xl2 p-6 text-center sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          Valor del diagnóstico completo
        </p>
        <p className="mt-1 text-3xl font-extrabold text-gradient">US$500</p>
        <p className="mt-2 text-sm text-ink-mute">
          Lo preparamos completo con tu data y te lo enviamos al mail al agendar.
          Vigencia <span className="font-semibold text-ink">48 horas</span>.
        </p>

        <button
          type="button"
          onClick={onBook}
          className="bg-gradient-brand mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-bg transition-transform duration-200 hover:scale-[1.02] active:scale-100"
        >
          Agendar mi sesión 1:1
        </button>
        <p className="mt-3 text-center font-mono text-xs text-ink-faint">
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

function StageRow({ area, index }: { area: AreaResult; index: number }) {
  const locked = LOCKED.has(area.key);
  return (
    <div className="flex items-start gap-3 border-b border-hair/40 py-2.5 last:border-0">
      <span className="w-5 shrink-0 font-mono text-xs text-ink-faint">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-ink">{area.label}</span>
          {locked ? <LockBadge /> : <StatusBadge status={area.status} />}
        </div>
        {locked ? (
          <p className="mt-0.5 text-xs text-ink-faint">
            Necesita tu data interna · se profundiza en la llamada
          </p>
        ) : area.status === "Urgente" ? (
          <p className="mt-0.5 text-xs text-ink-mute">{area.finding}</p>
        ) : null}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Sano: "bg-emerald-500/15 text-emerald-300",
  Optimizable: "bg-amber-500/15 text-amber-300",
  Urgente: "bg-red-500/15 text-red-300",
};

function StatusBadge({ status }: { status: AreaResult["status"] }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function LockBadge() {
  return (
    <span className="shrink-0 rounded-full bg-bg-soft px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
      🔒 En la llamada
    </span>
  );
}
