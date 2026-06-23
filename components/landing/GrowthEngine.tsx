// Sección 3 — Growth Engine: grilla de 8 etapas + bloque del "compuesto".
// Esta es la sección diferenciadora.

const stages = [
  { n: "01", name: "Foundations", line: "A quién vendes y por qué." },
  { n: "02", name: "Offer", line: "Qué vendes y por qué tú." },
  { n: "03", name: "Validation", line: "Qué dice el mercado." },
  { n: "04", name: "Acquisition", line: "Tráfico que convierte." },
  { n: "05", name: "Workflows", line: "Tus herramientas, conectadas." },
  { n: "06", name: "Retention", line: "Que vuelvan a comprar." },
  { n: "07", name: "Feedback", line: "Escuchar al mercado." },
  { n: "08", name: "Systems", line: "Automatizar lo que funciona." },
];

export function GrowthEngine() {
  return (
    <section className="relative overflow-hidden px-6 py-20">
      <div className="glow-violet pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] opacity-40" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            El sistema
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            8 etapas. Un solo motor.
          </h2>
          <p className="mt-4 text-ink-mute">
            Cada etapa potencia a la siguiente. Por eso el orden importa.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s) => (
            <article
              key={s.n}
              className="glass group flex flex-col rounded-xl2 p-6 transition-colors hover:border-violet/40"
            >
              <span className="font-mono text-2xl font-bold text-gradient">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">
                {s.line}
              </p>
            </article>
          ))}
        </div>

        {/* Bloque del compuesto */}
        <div className="glass mx-auto mt-10 max-w-3xl rounded-xl2 p-8 text-center sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
            El compuesto
          </p>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink sm:text-xl">
            Cada etapa acelera la siguiente: mejor validación baja tu CAC, mejor
            adquisición llena tu retención.{" "}
            <span className="font-semibold text-gradient">
              Eso es el compuesto
            </span>{" "}
            — lo que un proveedor suelto nunca te da.
          </p>
        </div>
      </div>
    </section>
  );
}
