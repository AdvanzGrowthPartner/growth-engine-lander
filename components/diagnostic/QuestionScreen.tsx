import type { Question } from "@/types/diagnostic";

// Pantallas 2-6 — Una pregunta por pantalla. Avanza al seleccionar.
export function QuestionScreen({
  question,
  selected,
  onAnswer,
}: {
  question: Question;
  selected: number | undefined;
  onAnswer: (score: number) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink sm:text-3xl">
        {question.prompt}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt) => {
          const isActive = selected === opt.score;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onAnswer(opt.score)}
              aria-pressed={isActive}
              className={`flex min-h-[56px] w-full items-center rounded-xl2 border px-5 py-4 text-left transition-colors ${
                isActive
                  ? "border-violet bg-violet/10 text-ink"
                  : "border-hair bg-bg-card/50 text-ink-mute hover:border-violet/50 hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
