// Sección 5 — Prueba social: resultados reales por vertical + autoridad + testimonio.
// Números tomados de la página viva de Advanz (sancionados). Reemplazar/ampliar
// con data real fresca cuando esté (se puede sacar de Dashbo / Meta).

const results = [
  { emoji: "👙", vertical: "Marca de ropa", growth: "+57%" },
  { emoji: "💊", vertical: "Suplementos", growth: "+117%" },
  { emoji: "👗", vertical: "Vestidos", growth: "+112%" },
  { emoji: "💻", vertical: "Tecnología", growth: "+92%" },
  { emoji: "🪑", vertical: "Muebles", growth: "+38%" },
];

const stats = [
  { value: "+10", label: "tiendas escaladas" },
  { value: "+$10M", label: "USD generados" },
  { value: "+$1M", label: "USD invertidos en ads" },
  { value: "8.760", label: "hrs ahorradas con IA" },
];

export function SocialProof() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            Resultados reales
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            No es teoría. Es plata en la cuenta de nuestros clientes.
          </h2>
        </div>

        {/* Resultados por vertical */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {results.map((r) => (
            <div key={r.vertical} className="glass rounded-xl2 p-5 text-center">
              <div className="text-3xl">{r.emoji}</div>
              <p className="mt-2 text-2xl font-extrabold text-gradient">
                {r.growth}
              </p>
              <p className="mt-1 text-xs text-ink-mute">{r.vertical}</p>
            </div>
          ))}
        </div>

        {/* Cifras agregadas */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-ink sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-ink-faint">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonio compacto */}
        <figure className="glass mt-10 rounded-xl2 p-6 sm:p-8">
          <blockquote className="text-pretty text-lg font-medium leading-relaxed text-ink">
            “Dejamos de probar cosas sueltas. Pusimos orden con el Growth Engine
            y por primera vez sabemos por qué crecen los números.”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand font-bold text-bg">
              E
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Egly</span>
              <span className="block font-mono text-xs uppercase tracking-widest text-ink-faint">
                CasaBliss
              </span>
            </span>
          </figcaption>
        </figure>

        <p className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-ink-faint">
          Shopify Partner · Meta Business Partner · Google Partner
        </p>
      </div>
    </section>
  );
}
