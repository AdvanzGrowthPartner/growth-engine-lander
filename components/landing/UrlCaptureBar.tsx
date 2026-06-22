"use client";

import { useState } from "react";
import { useDiagnostic } from "@/components/diagnostic/DiagnosticProvider";

// Barra de captura de URL del hero.
// Guarda la URL en el contexto y abre el diagnóstico en un solo gesto.
export function UrlCaptureBar() {
  const { open } = useDiagnostic();
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    open(url);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-faint">
          https://
        </span>
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="tutienda.cl"
          aria-label="URL de tu tienda"
          className="min-h-[52px] w-full rounded-full border border-hair bg-bg-card/70 py-3 pl-[5.5rem] pr-4 text-ink placeholder:text-ink-faint focus:border-violet/60 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-gradient-brand inline-flex min-h-[52px] items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-bg transition-transform duration-200 hover:scale-[1.02] active:scale-100"
      >
        Quiero mi Growth Score
      </button>
    </form>
  );
}
