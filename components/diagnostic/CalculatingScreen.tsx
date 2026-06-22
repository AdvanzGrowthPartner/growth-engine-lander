"use client";

import { useEffect, useState } from "react";
import type { SiteSignals } from "@/types/diagnostic";

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

// Pantalla 8 — Calculando: corre el análisis REAL de la tienda mientras se
// iluminan las 8 etapas. La animación cubre la latencia del fetch (es honesto).
export function CalculatingScreen({
  url,
  onComplete,
}: {
  url: string;
  onComplete: (signals: SiteSignals | null) => void;
}) {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const minMs = reduce ? 400 : 2400; // tiempo mínimo en pantalla
    const start = performance.now();

    let interval: ReturnType<typeof setInterval> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    if (!reduce) {
      interval = setInterval(() => {
        setLit((n) => (n >= STAGES.length ? n : n + 1));
      }, 260);
    }

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((signals: SiteSignals | null) => {
        if (cancelled) return;
        const wait = Math.max(0, minMs - (performance.now() - start));
        finishTimer = setTimeout(() => {
          if (cancelled) return;
          setLit(STAGES.length);
          onComplete(signals);
        }, wait);
      });

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [url, onComplete]);

  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Procesando
      </p>
      <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
        Analizando tu Growth Engine…
      </h2>
      <p className="mt-2 text-sm text-ink-mute">
        Revisando tu tienda con data pública.
      </p>

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
