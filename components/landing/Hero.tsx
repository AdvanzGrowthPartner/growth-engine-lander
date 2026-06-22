import { UrlCaptureBar } from "@/components/landing/UrlCaptureBar";

// Sección 1 — Hero centrado: headline + VSL placeholder + barra de captura de URL.
export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24"
    >
      {/* Glows ambientales */}
      <div className="glow-violet pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 opacity-70" />
      <div className="glow-cyan pointer-events-none absolute top-40 -right-40 h-[400px] w-[400px] opacity-60" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-hair bg-bg-card/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
          Diagnóstico gratuito · 90 segundos
        </p>

        <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          Cambiaste de agencia, subiste el presupuesto, probaste otro creativo.{" "}
          <span className="text-gradient">Y algo sigue sin cerrar.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-ink-mute sm:text-xl">
          El problema no es tu tráfico. Es que estás adivinando qué parte de tu
          ecommerce está rota. Dejá la URL de tu tienda y descubrí exactamente
          dónde está la fuga.
        </p>

        {/* VSL placeholder 16:9 — listo para enchufar un video después */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="glass group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl2">
            <div className="glow-violet pointer-events-none absolute inset-0 opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
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
              <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                Video · próximamente
              </span>
            </div>
          </div>
        </div>

        {/* Barra de captura de URL */}
        <div className="mt-10">
          <UrlCaptureBar />
          <p className="mt-3 font-mono text-xs text-ink-faint">
            Sin tarjeta · sin compromiso · resultado en pantalla
          </p>
        </div>
      </div>
    </section>
  );
}
