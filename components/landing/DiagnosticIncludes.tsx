// Sección 4 — Qué incluye el diagnóstico: 6 tarjetas de lo que analiza.

const items = [
  {
    title: "Velocidad y experiencia mobile",
    body: "Qué tan rápido responde tu tienda y si está lista para vender en celular.",
  },
  {
    title: "Plataforma y base técnica",
    body: "Sobre qué está construida tu tienda y qué tan sólida es su base.",
  },
  {
    title: "Tracking y medición",
    body: "Si tienes Pixel y analítica para medir lo que inviertes en ads.",
  },
  {
    title: "Retención y email",
    body: "Si tienes herramientas de email para que el cliente vuelva a comprar.",
  },
  {
    title: "Prueba social y reseñas",
    body: "Si tu tienda muestra reseñas que reducen la duda al comprar.",
  },
  {
    title: "Tu contexto de negocio",
    body: "Tu facturación, oferta y forma de decidir — lo que no se ve desde afuera.",
  },
];

export function DiagnosticIncludes() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            El diagnóstico
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Qué analizamos de tu ecommerce
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article key={it.title} className="glass rounded-xl2 p-6">
              <span className="font-mono text-sm text-cyan">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">
                {it.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-faint">
          Combinamos el análisis de tu tienda (con data pública) con tus
          respuestas. Una auditoría completa va mucho más profundo.
        </p>
      </div>
    </section>
  );
}
