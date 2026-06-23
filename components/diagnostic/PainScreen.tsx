import { pains } from "@/lib/pains";
import { OptionButton } from "@/components/diagnostic/OptionButton";

// Pantalla 1 — Dolores: selección única, avanza al elegir.
export function PainScreen({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (pain: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold leading-tight text-ink sm:text-3xl">
        ¿Qué es lo que más te frena hoy?
      </h2>
      <p className="mt-2 text-ink-mute">Elige la que más te representa.</p>

      <div className="mt-6 flex flex-col gap-3">
        {pains.map((pain) => (
          <OptionButton
            key={pain}
            active={selected === pain}
            onClick={() => onSelect(pain)}
          >
            {pain}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
