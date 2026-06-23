// Sección 5 — Prueba social: testimonio + métricas reales + fila de autoridad.

const metrics = [
  { value: "+57%", label: "facturación promedio a 90 días" },
  { value: "3,4x", label: "ROAS promedio en clientes activos" },
  { value: "+34%", label: "tasa de recompra con retención" },
];

const authority = [
  "Shopify Partner",
  "+40 tiendas escaladas",
  "Google Partner",
  "Meta Business Partner",
  "Metodología propia",
];

export function SocialProof() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Testimonio */}
        <figure className="glass rounded-xl3 p-8 sm:p-12">
          <blockquote className="text-pretty text-xl font-medium leading-relaxed text-ink sm:text-2xl">
            “Dejamos de probar cosas sueltas. Con el Growth Engine pusimos orden:
            primero entendimos qué estaba roto, después lo arreglamos por
            prioridad. Por primera vez sabemos por qué crecen los números.”
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand font-bold text-bg">
              E
            </span>
            <span>
              <span className="block font-semibold text-ink">Egly</span>
              <span className="block font-mono text-xs uppercase tracking-widest text-ink-faint">
                CasaBliss
              </span>
            </span>
          </figcaption>
        </figure>

        {/* Métricas (placeholders) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="glass rounded-xl2 p-7 text-center"
            >
              <p className="text-4xl font-extrabold text-gradient">{m.value}</p>
              <p className="mt-1 text-sm text-ink-mute">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Fila de autoridad */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {authority.map((a) => (
            <span
              key={a}
              className="font-mono text-xs uppercase tracking-widest text-ink-faint"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
