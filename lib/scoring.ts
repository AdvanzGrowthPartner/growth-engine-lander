import { questions } from "@/lib/questions";
import type {
  DiagnosticResult,
  Gap,
  Level,
  StageKey,
} from "@/types/diagnostic";

export const MAX_SCORE = 80;

// Nombres legibles (en español) de cada etapa para mostrar en el resultado.
export const STAGE_LABELS: Record<StageKey, string> = {
  Madurez: "Madurez del negocio",
  Acquisition: "Adquisición",
  "Offer + Validation": "Oferta + Validación",
  Retention: "Retención",
  "Feedback + Systems": "Feedback + Sistemas",
};

const LEVEL_TEXT: Record<Level, string> = {
  Crítico:
    "Tu motor tiene fugas en varias etapas a la vez. La buena noticia: hay mucho margen y un orden claro para destrabarlo.",
  Intermedio:
    "Tenés una base que funciona, pero hay 2 o 3 etapas que le están poniendo techo al resto. Ahí está tu mayor oportunidad.",
  Avanzado:
    "Tu motor está bien armado. Lo que te separa del siguiente nivel son ajustes finos en etapas puntuales.",
};

const GAP_TEXT: Record<StageKey, string> = {
  Acquisition:
    "Tu adquisición no rinde lo que invertís. Probable fuga de presupuesto antes de la conversión.",
  "Offer + Validation":
    "No está claro por qué te compran. Sin esto validado, todo lo de arriba escala adivinando.",
  Retention:
    "Estás dejando LTV sobre la mesa. Sin recompra, cada venta cuesta el doble.",
  "Feedback + Systems":
    "Decidís sin data en tiempo real. Difícil saber qué mover sin volar a ciegas.",
  Madurez:
    "Tu etapa de negocio pide foco en fundamentos antes de escalar gasto.",
};

function levelFor(score: number): Level {
  if (score >= 56) return "Avanzado";
  if (score >= 36) return "Intermedio";
  return "Crítico";
}

// Calcula el Growth Score y detecta las 3 etapas más débiles.
export function computeResult(
  answers: Record<string, number>
): DiagnosticResult {
  const raw = questions.reduce((sum, q) => sum + (answers[q.key] ?? 0), 0); // 5–25
  const score = Math.round((raw / 25) * MAX_SCORE); // sobre 80
  const level = levelFor(score);

  const gaps: Gap[] = questions
    .map((q) => ({ stage: q.stage, score: answers[q.key] ?? 0 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => ({
      stage: s.stage,
      label: STAGE_LABELS[s.stage],
      score: s.score,
      text: GAP_TEXT[s.stage],
    }));

  return { score, level, levelText: LEVEL_TEXT[level], gaps };
}
