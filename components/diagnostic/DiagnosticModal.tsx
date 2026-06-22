"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { useDiagnostic } from "@/components/diagnostic/DiagnosticProvider";
import { questions } from "@/lib/questions";
import { computeResult } from "@/lib/scoring";
import type { DiagnosticResult, Lead, SiteSignals } from "@/types/diagnostic";

import { ProgressBar } from "@/components/diagnostic/ProgressBar";
import { IntroScreen } from "@/components/diagnostic/IntroScreen";
import { PainScreen } from "@/components/diagnostic/PainScreen";
import { QuestionScreen } from "@/components/diagnostic/QuestionScreen";
import { GateScreen } from "@/components/diagnostic/GateScreen";
import { CalculatingScreen } from "@/components/diagnostic/CalculatingScreen";
import { ResultScreen } from "@/components/diagnostic/ResultScreen";

// ----------------------------------------------------------------
// Estado del diagnóstico (un solo useReducer, como pide el brief).
// ----------------------------------------------------------------
type Step =
  | "intro"
  | "pains"
  | "question"
  | "gate"
  | "calculating"
  | "result";

type State = {
  step: Step;
  questionIndex: number;
  pain: string | null;
  answers: Record<string, number>;
  lead: Lead;
  signals: SiteSignals | null;
  result: DiagnosticResult | null;
};

type Action =
  | { type: "INIT"; url: string }
  | { type: "START" }
  | { type: "SELECT_PAIN"; pain: string }
  | { type: "ANSWER"; score: number }
  | { type: "BACK" }
  | { type: "SET_LEAD"; field: keyof Lead; value: string }
  | { type: "SUBMIT" }
  | { type: "FINISH"; signals: SiteSignals | null };

function initialState(url = ""): State {
  return {
    step: "intro",
    questionIndex: 0,
    pain: null,
    answers: {},
    lead: { name: "", email: "", whatsapp: "", url },
    signals: null,
    result: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return initialState(action.url);

    case "START":
      return { ...state, step: "pains" };

    case "SELECT_PAIN":
      return { ...state, pain: action.pain, step: "question", questionIndex: 0 };

    case "ANSWER": {
      const q = questions[state.questionIndex];
      const answers = { ...state.answers, [q.key]: action.score };
      if (state.questionIndex < questions.length - 1) {
        return { ...state, answers, questionIndex: state.questionIndex + 1 };
      }
      return { ...state, answers, step: "gate" };
    }

    case "BACK": {
      if (state.step === "pains") return { ...state, step: "intro" };
      if (state.step === "question") {
        if (state.questionIndex === 0) return { ...state, step: "pains" };
        return { ...state, questionIndex: state.questionIndex - 1 };
      }
      if (state.step === "gate") {
        return { ...state, step: "question", questionIndex: questions.length - 1 };
      }
      return state;
    }

    case "SET_LEAD":
      return { ...state, lead: { ...state.lead, [action.field]: action.value } };

    case "SUBMIT":
      return { ...state, step: "calculating" };

    case "FINISH":
      return {
        ...state,
        step: "result",
        signals: action.signals,
        result: computeResult(state.answers, action.signals),
      };

    default:
      return state;
  }
}

// Progreso visible solo en pains → preguntas → gate (6 pasos).
function progressInfo(state: State): { current: number; total: number } | null {
  if (state.step === "pains") return { current: 1, total: 6 };
  if (state.step === "question")
    return { current: state.questionIndex + 2, total: 6 };
  if (state.step === "gate") return { current: 6, total: 6 };
  return null;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// ----------------------------------------------------------------
// Componente
// ----------------------------------------------------------------
export function DiagnosticModal() {
  const { isOpen, storeUrl, close } = useDiagnostic();
  const [state, dispatch] = useReducer(reducer, "", initialState);

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  // Callback estable para que CalculatingScreen no re-dispare el análisis.
  const handleFinish = useCallback(
    (signals: SiteSignals | null) => dispatch({ type: "FINISH", signals }),
    []
  );

  // Reset al abrir, con la URL capturada.
  useEffect(() => {
    if (isOpen) dispatch({ type: "INIT", url: storeUrl });
  }, [isOpen, storeUrl]);

  // Bloqueo de scroll + restaurar foco al cerrar.
  useEffect(() => {
    if (!isOpen) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      prevFocus.current?.focus?.();
    };
  }, [isOpen]);

  // Escape + focus trap (Tab) dentro del panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const node = panelRef.current;
      if (!node) return;
      const items = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Mover el foco al primer elemento útil en cada cambio de pantalla.
  useEffect(() => {
    if (!isOpen) return;
    const node = contentRef.current;
    if (!node) return;
    const first = node.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panelRef.current)?.focus();
  }, [isOpen, state.step, state.questionIndex]);

  if (!isOpen) return null;

  const progress = progressInfo(state);
  const canGoBack =
    state.step === "pains" ||
    state.step === "question" ||
    state.step === "gate";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-bg/85 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Diagnóstico Growth Score"
        tabIndex={-1}
        className="glass relative my-auto w-full max-w-lg rounded-xl3 p-6 outline-none sm:p-8"
      >
        {/* Header: atrás + progreso + cerrar */}
        <div className="mb-6 flex items-center gap-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={() => dispatch({ type: "BACK" })}
              aria-label="Volver al paso anterior"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hair text-ink-mute transition-colors hover:text-ink"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                  d="M12 4l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <span className="h-9 w-9 shrink-0" />
          )}

          <div className="flex-1">
            {progress && (
              <ProgressBar current={progress.current} total={progress.total} />
            )}
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Cerrar diagnóstico"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hair text-ink-mute transition-colors hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Contenido por pantalla */}
        <div ref={contentRef} key={`${state.step}-${state.questionIndex}`}>
          {state.step === "intro" && (
            <IntroScreen
              url={state.lead.url}
              onStart={() => dispatch({ type: "START" })}
            />
          )}

          {state.step === "pains" && (
            <PainScreen
              selected={state.pain}
              onSelect={(pain) => dispatch({ type: "SELECT_PAIN", pain })}
            />
          )}

          {state.step === "question" && (
            <QuestionScreen
              question={questions[state.questionIndex]}
              selected={state.answers[questions[state.questionIndex].key]}
              onAnswer={(score) => dispatch({ type: "ANSWER", score })}
            />
          )}

          {state.step === "gate" && (
            <GateScreen
              lead={state.lead}
              needsUrl={!state.lead.url.trim()}
              onChange={(field, value) =>
                dispatch({ type: "SET_LEAD", field, value })
              }
              onSubmit={() => dispatch({ type: "SUBMIT" })}
            />
          )}

          {state.step === "calculating" && (
            <CalculatingScreen url={state.lead.url} onComplete={handleFinish} />
          )}

          {state.step === "result" && state.result && (
            <ResultScreen
              result={state.result}
              url={state.lead.url}
              email={state.lead.email}
              onBook={() =>
                window.open(
                  "https://web.advanz.cl",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
