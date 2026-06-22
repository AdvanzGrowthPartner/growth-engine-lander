// Tipos del diagnóstico interactivo.

// Cada pregunta mapea a una etapa del Growth Engine.
export type StageKey =
  | "Madurez"
  | "Acquisition"
  | "Offer + Validation"
  | "Retention"
  | "Feedback + Systems";

export type QuestionOption = {
  label: string;
  score: number; // 1-5 (oculto al usuario)
};

export type Question = {
  key: string; // identificador estable: "facturacion", "ads", ...
  stage: StageKey;
  prompt: string;
  options: QuestionOption[];
};

export type Level = "Crítico" | "Intermedio" | "Avanzado";

export type Gap = {
  stage: StageKey;
  label: string; // nombre legible en español
  score: number;
  text: string; // explicación del gap
};

export type DiagnosticResult = {
  score: number; // sobre 80
  level: Level;
  levelText: string;
  gaps: Gap[]; // las 3 etapas más débiles
};

// Datos de captura (gate).
export type Lead = {
  name: string;
  email: string;
  whatsapp: string;
  url: string;
};
