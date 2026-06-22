import { CTAButton } from "@/components/landing/CTAButton";

// Sección 6 — Cómo funciona (3 pasos) + bloque CTA final con objection handling.

const steps = [
  {
    n: "01",
    title: "Dejás la URL de tu tienda",
    body: "Sin instalar nada. Analizamos con data pública.",
  },
  {
    n: "02",
    title: "Respondés 6 preguntas rápidas",
    body: "Te toma unos 90 segundos. Una pantalla a la vez.",
  },
  {
    n: "03",
    title: "Recibís tu Growth Score",
    body: "En pantalla al instante, más el informe completo por mail.",
  },
];

const objections = ["Sin tarjeta", "Cualquier ecommerce", "Resultado inmediato"];

export function FinalCTA() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Cómo funciona */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            Cómo funciona
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Tres pasos para saber dónde está la fuga
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-xl2 p-7">
              <span className="font-mono text-2xl font-bold text-gradient">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-mute">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Bloque CTA final */}
        <div className="glass relative mt-12 overflow-hidden rounded-xl3 p-10 text-center sm:p-14">
          <div className="glow-violet pointer-events-none absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 opacity-50" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Descubrí tu Growth Score{" "}
              <span className="text-gradient">en 90 segundos</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-mute">
              Dejá de adivinar qué arreglar. Empezá por saber exactamente dónde
              está la fuga.
            </p>

            <div className="mt-8 flex justify-center">
              <CTAButton />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {objections.map((o) => (
                <span
                  key={o}
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-faint"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3.5 w-3.5 text-cyan"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
