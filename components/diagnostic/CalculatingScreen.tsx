"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Foundations",
  "Offer",
  "Validation",
  "Acquisition",
  "Workflows",
  "Retention",
  "Feedback",
  "Systems",
];

// Pantalla 8 — Calculando: las 8 etapas se iluminan una a una, después pasa al resultado.
export function CalculatingScreen({ onComplete }: { onComplete: () => void }) {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const t = setTimeout(() => {
        setLit(STAGES.length);
        onComplete();
      }, 300);
      return () => clearTimeout(t);
    }

    const perStage = 260; // ms
    const interval = setInterval(() => {
      setLit((n) => {
        if (n >= STAGES.length) return n;
        return n + 1;
      });
    }, perStage);

    const done = setTimeout(onComplete, perStage * STAGES.length + 500);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Procesando
      </p>
      <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
        Analizando tu Growth Engine…
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAGES.map((stage, i) => {
          const active = i < lit;
          return (
            <div
              key={stage}
              className={`rounded-xl2 border px-3 py-4 transition-all duration-300 ${
                active
                  ? "border-violet/50 bg-violet/10 text-ink"
                  : "border-hair bg-bg-card/40 text-ink-faint"
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-wider">
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
