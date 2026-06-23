import type { Question } from "@/types/diagnostic";

// Las 6 preguntas del diagnóstico, alineadas a las etapas del Growth Engine.
// Cada opción lleva un puntaje oculto (1-5). Para cambiar una pregunta o un
// peso se edita SOLO acá — el diseño no se toca.
export const questions: Question[] = [
  {
    key: "facturacion",
    stage: "Contexto",
    prompt: "¿Cuál es tu facturación mensual promedio?",
    options: [
      { label: "Menos de $5.000 USD", score: 1 },
      { label: "$5.000 – $15.000 USD", score: 2 },
      { label: "$15.000 – $50.000 USD", score: 4 },
      { label: "Más de $50.000 USD", score: 5 },
    ],
  },
  {
    key: "oferta",
    stage: "Offer",
    prompt: "¿Qué tan claro tienes por qué te compran a ti y no a otro?",
    options: [
      { label: "Lo tengo muy claro y validado con data", score: 5 },
      { label: "Tengo una idea pero no lo confirmé", score: 3 },
      { label: "Es más intuición que certeza", score: 2 },
      { label: "La verdad, no lo sé", score: 1 },
    ],
  },
  {
    key: "ads",
    stage: "Acquisition",
    prompt: "¿Cuánto inviertes en publicidad al mes?",
    options: [
      { label: "Todavía no invierto", score: 1 },
      { label: "Menos de $1.000 USD", score: 2 },
      { label: "$1.000 – $5.000 USD", score: 4 },
      { label: "Más de $5.000 USD", score: 5 },
    ],
  },
  {
    key: "retencion",
    stage: "Retention",
    prompt: "¿Cómo está tu retención y recompra?",
    options: [
      { label: "Tengo flujos de email/automatización funcionando", score: 5 },
      { label: "Algo armé pero no sé si funciona", score: 3 },
      { label: "Sé que debería pero no lo tengo", score: 2 },
      { label: "No sé de qué me hablas", score: 1 },
    ],
  },
  {
    key: "decision",
    stage: "Systems",
    prompt: "¿Cómo tomas las decisiones de tu ecommerce hoy?",
    options: [
      { label: "Con dashboards y data en tiempo real", score: 5 },
      { label: "Reviso métricas de vez en cuando", score: 3 },
      { label: "Más por intuición y experiencia", score: 2 },
      { label: "Voy apagando incendios", score: 1 },
    ],
  },
];
