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

// Orden canónico de las 8 etapas (no negociable).
export const STAGE_ORDER: AreaKey[] = [
  "Foundations",
  "Offer",
  "Validation",
  "Acquisition",
  "Workflows",
  "Retention",
  "Feedback",
  "Systems",
];

// Etiquetas (coinciden con la sección de 8 etapas del lander).
export const AREA_LABELS: Record<AreaKey, string> = {
  Foundations: "Foundations",
  Offer: "Offer",
  Validation: "Validation",
  Acquisition: "Acquisition",
  Workflows: "Workflows",
  Retention: "Retention",
  Feedback: "Feedback",
  Systems: "Systems",
};

const LEVEL_TEXT: Record<Level, string> = {
  Crítico:
    "Tu motor tiene fugas en varias etapas a la vez. La buena noticia: hay mucho margen y un orden claro para destrabarlo.",
  Intermedio:
    "Tienes una base que funciona, pero hay 2 o 3 etapas que le están poniendo techo al resto. Ahí está tu mayor oportunidad.",
  Avanzado:
    "Tu motor está bien armado. Lo que te separa del siguiente nivel son ajustes finos en etapas puntuales.",
};

const GENERIC_FINDING: Record<AreaKey, string> = {
  Foundations:
    "Tu base técnica tiene margen para cargar más rápido y convertir mejor.",
  Offer: "No está del todo claro por qué te compran a ti y no a otro.",
  Validation:
    "Te falta validar con data qué funciona antes de escalar la inversión.",
  Acquisition:
    "Tu adquisición no rinde lo que inviertes. Probable fuga de presupuesto antes de la conversión.",
  Workflows:
    "Tus herramientas no están conectadas: el trabajo de cada una no se compone.",
  Retention:
    "Estás dejando LTV sobre la mesa. Sin recompra, cada venta cuesta el doble.",
  Feedback:
    "No estás escuchando al mercado de forma sistemática (reseñas, voz del cliente).",
  Systems:
    "Decides sin data en tiempo real y con procesos manuales que no escalan.",
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

export function computeResult(
  answers: Record<string, number>,
  signals: SiteSignals | null
): DiagnosticResult {
  const analyzed = !!signals?.ok;
  const detected: string[] = [];

  // Estado por etapa (estilo Harubom).
  const statusFor = (s: number): AreaResult["status"] =>
    s >= 72 ? "Sano" : s >= 48 ? "Optimizable" : "Urgente";

  // Helper: arma un área mezclando quiz + señal.
  const make = (
    key: AreaKey,
    score: number,
    finding: string,
    isDetected: boolean
  ): AreaResult => {
    const s = clamp(score);
    return {
      key,
      label: AREA_LABELS[key],
      score: s,
      status: statusFor(s),
      finding,
      detected: isDetected,
    };
  };

  // ---- Señales auxiliares (0-100) ----
  const sigOffer = analyzed && signals ? (signals.hasSchema ? 100 : 55) : 60;
  const sigAcq =
    analyzed && signals
      ? signals.hasMetaPixel
        ? 100
        : signals.hasGA
          ? 70
          : 40
      : 60;
  const sigEmail = analyzed && signals ? (signals.hasEmailApp ? 100 : 35) : 55;
  const sigReviews = analyzed && signals ? (signals.hasReviewsApp ? 100 : 30) : 50;

  // ---- 1. Foundations (técnica / AI-readiness base, solo señal) ----
  let foundationsScore: number;
  let foundationsFinding = GENERIC_FINDING.Foundations;
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
    }
  } else {
    foundationsScore = 55;
  }

  // ---- 2. Offer (quiz + schema) ----
  const offerScore = analyzed
    ? 0.6 * quizPct(answers, "oferta") + 0.4 * sigOffer
    : quizPct(answers, "oferta");
  const offerNoSchema = analyzed && signals && !signals.hasSchema;
  const offerFinding = offerNoSchema
    ? "Tus páginas no tienen datos estructurados (schema): Google y los agentes de IA no entienden bien tu oferta."
    : GENERIC_FINDING.Offer;

  // ---- 3. Validation (proxy: claridad de oferta + prueba social) ----
  const validationScore = analyzed
    ? (quizPct(answers, "oferta") + sigReviews) / 2
    : quizPct(answers, "oferta");

  // ---- 4. Acquisition (quiz + tracking) ----
  const acqScore = analyzed
    ? 0.6 * quizPct(answers, "ads") + 0.4 * sigAcq
    : quizPct(answers, "ads");
  const acqNoTracking =
    analyzed && signals && !signals.hasGA && !signals.hasMetaPixel;
  const acqFinding = acqNoTracking
    ? "No detectamos Pixel ni Google Analytics en tu home — mides tus ads casi a ciegas."
    : GENERIC_FINDING.Acquisition;

  // ---- 5. Workflows (quiz + email/automatización) ----
  const wfScore = analyzed
    ? 0.6 * quizPct(answers, "workflows") + 0.4 * sigEmail
    : quizPct(answers, "workflows");
  const wfNoEmail = analyzed && signals && !signals.hasEmailApp;
  const wfFinding = wfNoEmail
    ? "No detectamos herramientas de email/automatización conectadas a tu tienda."
    : GENERIC_FINDING.Workflows;

  // ---- 6. Retention (quiz + email) ----
  const retScore = analyzed
    ? 0.55 * quizPct(answers, "retencion") + 0.45 * sigEmail
    : quizPct(answers, "retencion");
  const retNoEmail = analyzed && signals && !signals.hasEmailApp;
  const retFinding = retNoEmail
    ? "Sin email marketing activo, cada cliente que compra se va y no vuelve."
    : GENERIC_FINDING.Retention;

  // ---- 7. Feedback (solo señal: reseñas) ----
  const fbScore = analyzed && signals ? (signals.hasReviewsApp ? 100 : 30) : 50;
  const fbNoReviews = analyzed && signals && !signals.hasReviewsApp;
  const fbFinding = fbNoReviews
    ? "No vemos reseñas ni captura de feedback — no estás escuchando a tu mercado."
    : GENERIC_FINDING.Feedback;

  // ---- 8. Systems (solo quiz) ----
  const sysScore = quizPct(answers, "decision");

  const areas: AreaResult[] = [
    make("Foundations", foundationsScore, foundationsFinding, foundationsDetected),
    make("Offer", offerScore, offerFinding, !!offerNoSchema),
    make("Validation", validationScore, GENERIC_FINDING.Validation, false),
    make("Acquisition", acqScore, acqFinding, !!acqNoTracking),
    make("Workflows", wfScore, wfFinding, !!wfNoEmail),
    make("Retention", retScore, retFinding, !!retNoEmail),
    make("Feedback", fbScore, fbFinding, !!fbNoReviews),
    make("Systems", sysScore, GENERIC_FINDING.Systems, false),
  ];

  // ---- Score global (0-80) ----
  const avg = areas.reduce((s, a) => s + a.score, 0) / areas.length;
  const score = Math.round((avg / 100) * MAX_SCORE);
  const level = levelFor(score);

  // ---- Fugas: solo áreas realmente débiles (hasta 3), en ORDEN del Growth Engine ----
  // Si todo está fuerte, mostramos solo la etapa más floja como "próxima oportunidad".
  const WEAK_THRESHOLD = 60;
  const weak = [...areas]
    .filter((a) => a.score < WEAK_THRESHOLD)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  const selected = weak.length
    ? weak
    : [...areas].sort((a, b) => a.score - b.score).slice(0, 1);
  const gaps = selected.sort(
    (a, b) => STAGE_ORDER.indexOf(a.key) - STAGE_ORDER.indexOf(b.key)
  );

  // ---- Hallazgos reales (bloque "esto detectamos") ----
  if (analyzed && signals) {
    if (signals.platform) detected.push(`Plataforma: ${signals.platform}`);
    detected.push(
      signals.hasSchema ? "Datos estructurados (schema) ✓" : "Sin schema (AI-readiness)"
    );
    detected.push(
      signals.hasReviewsApp ? `Reseñas: ${signals.reviewsApp} ✓` : "Reseñas: no detectadas"
    );
    detected.push(
      signals.hasEmailApp ? `Email: ${signals.emailApp} ✓` : "Email marketing: no detectado"
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
