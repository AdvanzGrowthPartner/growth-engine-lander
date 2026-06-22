// Sección 4 — Qué incluye el diagnóstico: 6 tarjetas de lo que analiza.

const items = [
  {
    title: "Experiencia y velocidad",
    body: "Cómo carga y se siente tu tienda en mobile, donde se juega la venta.",
  },
  {
    title: "Claridad de la oferta",
    body: "Si en segundos se entiende qué vendés y por qué deberían elegirte.",
  },
  {
    title: "Señales de adquisición",
    body: "Tu presencia en ads y qué tan preparada está la tienda para convertir tráfico pago.",
  },
  {
    title: "Retención visible",
    body: "Indicios de email, recompra y programas que hacen volver al cliente.",
  },
  {
    title: "Confianza y prueba social",
    body: "Reseñas, garantías y señales que reducen la fricción de comprar.",
  },
  {
    title: "Preparación para IA y GEO",
    body: "Qué tan lista está tu tienda para la búsqueda generativa y los agentes de IA.",
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
          Todo esto lo analizamos desde afuera, con data pública de tu tienda.
          Una auditoría completa va mucho más profundo.
        </p>
      </div>
    </section>
  );
}
