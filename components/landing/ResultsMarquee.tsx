// Tira animada de resultados reales de clientes — loop infinito.
// Se ubica entre Hero y ProblemSolution como prueba social inmediata.

const results = [
  { industry: "Ropa", stat: "+57%", label: "facturación" },
  { industry: "Suplementos", stat: "+117%", label: "ROAS" },
  { industry: "Vestidos", stat: "+112%", label: "revenue en 90 días" },
  { industry: "Muebles", stat: "+38%", label: "conversión" },
  { industry: "Tecnología", stat: "+92%", label: "recuperación de carrito" },
  { industry: "Cosméticos", stat: "+3.4x", label: "retorno en ads" },
];

export function ResultsMarquee() {
  // Duplicamos el array para el loop visual sin corte
  const items = [...results, ...results];

  return (
    <div className="relative overflow-hidden border-y border-hair/60 py-4">
      {/* Fade lateral izquierdo */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-bg to-transparent" />
      {/* Fade lateral derecho */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-bg to-transparent" />

      <div className="animate-marquee flex w-max gap-10">
        {items.map((r, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-3"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
              {r.industry}
            </span>
            <span className="text-lg font-extrabold text-gradient">
              {r.stat}
            </span>
            <span className="text-sm text-ink-mute">{r.label}</span>
            <span className="ml-4 text-hair/80">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
