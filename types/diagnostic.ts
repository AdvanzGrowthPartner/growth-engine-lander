// Tipos del diagnóstico interactivo.

// Cada pregunta mapea a un área del Growth Engine.
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

// Datos de captura (gate).
export type Lead = {
  name: string;
  email: string;
  whatsapp: string;
  url: string;
};

// --------------------------------------------------------------
// Análisis real de la tienda (data pública detectada desde afuera).
// --------------------------------------------------------------
export type SiteSignals = {
  ok: boolean; // ¿se pudo analizar la tienda?
  url: string; // URL normalizada que se intentó analizar
  platform: string | null; // "Shopify" | "WooCommerce" | ...
  isShopify: boolean;
  hasMetaPixel: boolean;
  hasGA: boolean;
  hasReviewsApp: boolean;
  reviewsApp: string | null;
  hasEmailApp: boolean;
  emailApp: string | null;
  hasMobileViewport: boolean;
  isHttps: boolean;
  responseSeconds: number | null; // tiempo de respuesta del servidor (proxy de velocidad)
};

// --------------------------------------------------------------
// Resultado del diagnóstico.
// --------------------------------------------------------------
export type AreaKey =
  | "Foundations"
  | "Acquisition"
  | "Offer + Validation"
  | "Retention"
  | "Feedback + Systems";

export type AreaResult = {
  key: AreaKey;
  label: string; // nombre legible en español
  score: number; // 0-100
  finding: string; // hallazgo específico (si se detectó) o texto genérico
  detected: boolean; // true si proviene del análisis real de la tienda
};

export type LossEstimate = {
  low: number;
  high: number;
  currency: string; // "USD"
};

export type DiagnosticResult = {
  score: number; // sobre 80
  level: Level;
  levelText: string;
  areas: AreaResult[]; // las 5 áreas
  gaps: AreaResult[]; // las 3 más débiles
  loss: LossEstimate | null; // pérdida mensual estimada
  benchmark: { you: number; peers: number }; // tu score vs. pares (peers = estimado)
  detected: string[]; // hallazgos reales para el bloque "esto detectamos"
  analyzed: boolean; // ¿se analizó la tienda de verdad?
};
