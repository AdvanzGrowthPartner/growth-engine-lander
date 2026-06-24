import { BookingSection } from "@/components/landing/BookingSection";

// Sección 6 — Cómo funciona (3 pasos) + doble CTA: agendar (GHL) + form mail.

const steps = [
  {
    n: "01",
    title: "Nos compartes la URL de tu tienda",
    body: "Sin instalar nada. Analizamos con data pública más tus respuestas.",
  },
  {
    n: "02",
    title: "Agendas o dejas tu mail",
    body: "Diagnóstico en vivo de 30 min, o lo recibes detallado por correo.",
  },
  {
    n: "03",
    title: "Sabes exactamente qué arreglar primero",
    body: "Prioridades claras por etapa del Growth Engine, sin adivinar.",
  },
];

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

        {/* Doble CTA: agendar + mail */}
        <div className="mt-12">
          <BookingSection />
        </div>
      </div>
    </section>
  );
}
