"use client";

import { useRef, useState } from "react";

// Reproductor del VSL del hero: muestra el poster con botón play (look glass),
// al hacer clic reproduce el video con controles y sonido.
export function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    videoRef.current?.play();
  }

  return (
    <div className="glass relative aspect-video w-full overflow-hidden rounded-xl2">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/vsl.mp4"
        poster="/vsl-poster.jpg"
        controls={started}
        playsInline
        preload="metadata"
      />

      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label="Reproducir el video"
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/30 transition-colors hover:bg-bg/20"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand shadow-[0_8px_30px_rgba(193,93,255,0.4)] transition-transform duration-200 group-hover:scale-110">
            <svg
              viewBox="0 0 24 24"
              className="ml-1 h-7 w-7 text-bg"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ink">
            Ver cómo funciona · 60s
          </span>
        </button>
      )}
    </div>
  );
}
