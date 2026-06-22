import { pains } from "@/lib/pains";

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
      <h2 className="text-2xl font-bold text-ink sm:text-3xl">
        ¿Qué es lo que más te frena hoy?
      </h2>
      <p className="mt-2 text-ink-mute">Elegí la que más te representa.</p>

      <div className="mt-6 flex flex-col gap-3">
        {pains.map((pain) => {
          const isActive = selected === pain;
          return (
            <button
              key={pain}
              type="button"
              onClick={() => onSelect(pain)}
              aria-pressed={isActive}
              className={`flex min-h-[56px] w-full items-center rounded-xl2 border px-5 py-4 text-left transition-colors ${
                isActive
                  ? "border-violet bg-violet/10 text-ink"
                  : "border-hair bg-bg-card/50 text-ink-mute hover:border-violet/50 hover:text-ink"
              }`}
            >
              {pain}
            </button>
          );
        })}
      </div>
    </div>
  );
}
