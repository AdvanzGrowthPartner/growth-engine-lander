import type { Question } from "@/types/diagnostic";
import { OptionButton } from "@/components/diagnostic/OptionButton";

// Pantallas 2-7 — Una pregunta por pantalla. Avanza al seleccionar.
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
      <h2 className="text-2xl font-bold leading-tight text-ink sm:text-3xl">
        {question.prompt}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt) => (
          <OptionButton
            key={opt.label}
            active={selected === opt.score}
            onClick={() => onAnswer(opt.score)}
          >
            {opt.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
