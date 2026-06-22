// Sección 2 — Problema + Solución: 3 dolores y la barra que presenta el Growth Engine.

const pains = [
  {
    label: "Adquisición",
    title: "Metés plata en ads y el ROAS no acompaña",
    body: "Más presupuesto, mismo resultado. El tráfico llega pero la venta se cae antes de cerrar.",
  },
  {
    label: "Operación",
    title: "Proveedores sueltos que no conversan entre sí",
    body: "Cada uno optimiza su pedacito y nadie mira el negocio completo. El resultado no compone.",
  },
  {
    label: "Decisión",
    title: "Cambiás cosas sin saber cuál movió la aguja",
    body: "Decidís por intuición, no por data. Cada ajuste es una apuesta a ciegas.",
  },
];

export function ProblemSolution() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            El verdadero problema
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            No es una cosa. Son tres frentes que se traban entre sí.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pains.map((p) => (
            <article
              key={p.label}
              className="glass flex flex-col rounded-xl2 p-7"
            >
              <span className="mb-4 inline-flex w-fit rounded-full border border-hair px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink-mute">
                {p.label}
              </span>
              <h3 className="text-xl font-semibold text-ink">{p.title}</h3>
              <p className="mt-3 text-ink-mute">{p.body}</p>
            </article>
          ))}
        </div>

        {/* Barra: presenta el Growth Engine como sistema de 8 etapas */}
        <div className="glass mt-10 flex flex-col items-center gap-4 rounded-xl2 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="max-w-2xl text-lg text-ink">
            Por eso construimos el{" "}
            <span className="font-semibold text-gradient">Growth Engine™</span>:
            un sistema de{" "}
            <span className="font-semibold text-ink">8 etapas</span> que ordena
            todo tu ecommerce en un solo motor, en vez de parches sueltos.
          </p>
          <span className="shrink-0 font-mono text-sm uppercase tracking-widest text-cyan">
            8 etapas →
          </span>
        </div>
      </div>
    </section>
  );
}
