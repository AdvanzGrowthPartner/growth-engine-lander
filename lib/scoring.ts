import type {
  AreaKey,
  AreaResult,
  DiagnosticResult,
  Level,
  LossEstimate,
  SiteSignals,
} from "@/types/diagnostic";

export const MAX_SCORE = 80;

// Benchmark de referencia (PLACEHOLDER — reemplazar con dato real de Advanz).
export const PEER_BENCHMARK = 63;

export const AREA_LABELS: Record<AreaKey, string> = {
  Foundations: "Fundamentos (técnica)",
  Acquisition: "Adquisición",
  "Offer + Validation": "Oferta + Validación",
  Retention: "Retención",
  "Feedback + Systems": "Feedback + Sistemas",
};

const LEVEL_TEXT: Record<Level, string> = {
  Crítico:
    "Tu motor tiene fugas en varias etapas a la vez. La buena noticia: hay mucho margen y un orden claro para destrabarlo.",
  Intermedio:
    "Tienes una base que funciona, pero hay 2 o 3 etapas que le están poniendo techo al resto. Ahí está tu mayor oportunidad.",
  Avanzado:
    "Tu motor está bien armado. Lo que te separa del siguiente nivel son ajustes finos en etapas puntuales.",
};

// Texto genérico por área (cuando no hay un hallazgo específico detectado).
const GENERIC_FINDING: Record<AreaKey, string> = {
  Foundations:
    "Tu base técnica tiene margen para cargar más rápido y convertir mejor.",
  Acquisition:
    "Tu adquisición no rinde lo que inviertes. Probable fuga de presupuesto antes de la conversión.",
  "Offer + Validation":
    "No está claro por qué te compran. Sin esto validado, todo lo de arriba escala adivinando.",
  Retention:
    "Estás dejando LTV sobre la mesa. Sin recompra, cada venta cuesta el doble.",
  "Feedback + Systems":
    "Decides sin data en tiempo real. Difícil saber qué mover sin volar a ciegas.",
};

function levelFor(score: number): Level {
  if (score >= 56) return "Avanzado";
  if (score >= 36) return "Intermedio";
  return "Crítico";
}

function quizPct(answers: Record<string, number>, key: string): number {
  const s = answers[key] ?? 3;
  return (s / 5) * 100;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Facturación mensual estimada (USD) según la respuesta de la pregunta 1.
function revenueMid(answers: Record<string, number>): number {
  switch (answers["facturacion"]) {
    case 5:
      return 75000;
    case 4:
      return 32000;
    case 2:
      return 10000;
    default:
      return 2500;
  }
}

function round100(n: number): number {
  return Math.round(n / 100) * 100;
}

// Construye una de las 5 áreas mezclando quiz + señales reales.
function buildArea(
  key: AreaKey,
  score: number,
  finding: string,
  detected: boolean
): AreaResult {
  return { key, label: AREA_LABELS[key], score: clamp(score), finding, detected };
}

export function computeResult(
  answers: Record<string, number>,
  signals: SiteSignals | null
): DiagnosticResult {
  const analyzed = !!signals?.ok;
  const detected: string[] = [];

  // ---- ÁREA: Fundamentos (solo análisis) ----
  let foundationsScore: number;
  let foundationsFinding: string;
  let foundationsDetected = false;
  if (analyzed && signals) {
    let f = 100;
    if (!signals.isHttps) f -= 25;
    if (!signals.hasMobileViewport) f -= 30;
    const rs = signals.responseSeconds;
    if (rs != null) {
      if (rs > 5) f -= 30;
      else if (rs > 3) f -= 15;
      else if (rs > 2) f -= 5;
    }
    foundationsScore = f;
    if (rs != null && rs > 3) {
      foundationsFinding = `Tu tienda tarda ~${rs}s en responder — las que venden bien están por debajo de 2-3s.`;
      foundationsDetected = true;
    } else if (!signals.hasMobileViewport) {
      foundationsFinding =
        "Tu tienda no está optimizada para mobile, donde se juega la mayoría de la venta.";
      foundationsDetected = true;
    } else if (!signals.isHttps) {
      foundationsFinding =
        "Tu tienda no usa HTTPS — genera desconfianza justo al momento de comprar.";
      foundationsDetected = true;
    } else {
      foundationsFinding = GENERIC_FINDING.Foundations;
    }
  } else {
    // Sin análisis: neutro derivado del quiz.
    foundationsScore =
      (quizPct(answers, "ads") + quizPct(answers, "decision")) / 2;
    foundationsFinding = GENERIC_FINDING.Foundations;
  }

  // ---- ÁREA: Adquisición (quiz ads + tracking) ----
  let acqAnalysis = 60;
  if (analyzed && signals) {
    acqAnalysis = signals.hasMetaPixel ? 100 : signals.hasGA ? 70 : 40;
  }
  const acqScore = analyzed
    ? 0.6 * quizPct(answers, "ads") + 0.4 * acqAnalysis
    : quizPct(answers, "ads");
  const acqNoTracking = analyzed && signals && !signals.hasGA && !signals.hasMetaPixel;
  const acqFinding = acqNoTracking
    ? "No detectamos Pixel ni Google Analytics en tu home — estás midiendo tus ads casi a ciegas."
    : GENERIC_FINDING.Acquisition;

  // ---- ÁREA: Oferta + Validación (quiz oferta + reseñas) ----
  let ovAnalysis = 60;
  if (analyzed && signals) ovAnalysis = signals.hasReviewsApp ? 100 : 45;
  const ovScore = analyzed
    ? 0.6 * quizPct(answers, "oferta") + 0.4 * ovAnalysis
    : quizPct(answers, "oferta");
  const ovNoReviews = analyzed && signals && !signals.hasReviewsApp;
  const ovFinding = ovNoReviews
    ? "No vemos reseñas ni prueba social en tu tienda — la gente duda y se va antes de comprar."
    : GENERIC_FINDING["Offer + Validation"];

  // ---- ÁREA: Retención (quiz retención + email) ----
  let retAnalysis = 55;
  if (analyzed && signals) retAnalysis = signals.hasEmailApp ? 100 : 30;
  const retScore = analyzed
    ? 0.55 * quizPct(answers, "retencion") + 0.45 * retAnalysis
    : quizPct(answers, "retencion");
  const retNoEmail = analyzed && signals && !signals.hasEmailApp;
  const retFinding = retNoEmail
    ? "No detectamos herramienta de email marketing — cada cliente que compra se va y no vuelve."
    : GENERIC_FINDING.Retention;

  // ---- ÁREA: Feedback + Sistemas (solo quiz) ----
  const fsScore = quizPct(answers, "decision");

  const areas: AreaResult[] = [
    buildArea("Foundations", foundationsScore, foundationsFinding, foundationsDetected),
    buildArea("Acquisition", acqScore, acqFinding, !!acqNoTracking),
    buildArea("Offer + Validation", ovScore, ovFinding, !!ovNoReviews),
    buildArea("Retention", retScore, retFinding, !!retNoEmail),
    buildArea("Feedback + Systems", fsScore, GENERIC_FINDING["Feedback + Systems"], false),
  ];

  // ---- Score global (0-80) ----
  const avg = areas.reduce((s, a) => s + a.score, 0) / areas.length;
  const score = Math.round((avg / 100) * MAX_SCORE);
  const level = levelFor(score);

  // ---- 3 fugas más débiles ----
  const gaps = [...areas].sort((a, b) => a.score - b.score).slice(0, 3);

  // ---- Hallazgos reales (bloque "esto detectamos") ----
  if (analyzed && signals) {
    if (signals.platform) detected.push(`Plataforma: ${signals.platform}`);
    detected.push(
      signals.hasReviewsApp
        ? `Reseñas: ${signals.reviewsApp} ✓`
        : "Reseñas: no detectadas"
    );
    detected.push(
      signals.hasEmailApp
        ? `Email marketing: ${signals.emailApp} ✓`
        : "Email marketing: no detectado"
    );
    if (signals.hasGA || signals.hasMetaPixel) {
      const t = [signals.hasMetaPixel && "Meta Pixel", signals.hasGA && "Google Analytics"]
        .filter(Boolean)
        .join(" + ");
      detected.push(`Tracking: ${t} ✓`);
    } else {
      detected.push("Tracking: no detectamos Pixel ni GA");
    }
    if (signals.responseSeconds != null)
      detected.push(`Responde en ${signals.responseSeconds}s`);
  }

  // ---- Pérdida mensual estimada ----
  const rev = revenueMid(answers);
  let low = 0;
  let high = 0;
  const retArea = areas.find((a) => a.key === "Retention")!;
  const acqArea = areas.find((a) => a.key === "Acquisition")!;
  if (retArea.score < 55) {
    low += rev * 0.08;
    high += rev * 0.18;
  }
  if (acqArea.score < 55) {
    low += rev * 0.05;
    high += rev * 0.12;
  }
  const loss: LossEstimate | null =
    low > 0 ? { low: round100(low), high: round100(high), currency: "USD" } : null;

  return {
    score,
    level,
    levelText: LEVEL_TEXT[level],
    areas,
    gaps,
    loss,
    benchmark: { you: score, peers: PEER_BENCHMARK },
    detected,
    analyzed,
  };
}
