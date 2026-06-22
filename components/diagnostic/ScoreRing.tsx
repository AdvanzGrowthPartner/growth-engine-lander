"use client";

import { useEffect, useState } from "react";
import { MAX_SCORE } from "@/lib/scoring";

// Anillo animado del Growth Score. Se achica solo en pantallas chicas vía className.
// El respeto a prefers-reduced-motion lo cubre globals.css (anula las transiciones);
// acá además evitamos el conteo del número para esos usuarios.
export function ScoreRing({
  score,
  max = MAX_SCORE,
}: {
  score: number;
  max?: number;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const target = Math.max(0, Math.min(1, score / max));

  const [progress, setProgress] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Llenar el anillo (la transición CSS se anula sola si reduce-motion).
    const fill = requestAnimationFrame(() => setProgress(target));

    if (reduce) {
      const jump = requestAnimationFrame(() => setDisplay(score));
      return () => {
        cancelAnimationFrame(fill);
        cancelAnimationFrame(jump);
      };
    }

    // Conteo del número.
    const duration = 1100;
    let start: number | null = null;
    let frame = 0;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.round(p * score));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(fill);
      cancelAnimationFrame(frame);
    };
  }, [score, target]);

  const offset = circumference * (1 - progress);

  return (
    <div className="relative mx-auto aspect-square w-44 max-w-[55vw] sm:w-52">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C15DFF" />
            <stop offset="100%" stopColor="#00DDFC" />
          </linearGradient>
        </defs>
        {/* Pista */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        {/* Progreso */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s ease-out" }}
        />
      </svg>
      {/* Número centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold text-ink sm:text-6xl">
          {display}
        </span>
        <span className="font-mono text-sm text-ink-faint">/ {max}</span>
      </div>
    </div>
  );
}
