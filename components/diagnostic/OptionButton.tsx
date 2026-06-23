// Botón de opción compartido (dolores + preguntas).
// Mobile-first: texto brillante, grande y target táctil generoso.
export function OptionButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[60px] w-full items-center rounded-xl2 border px-5 py-4 text-left text-base font-medium leading-snug transition-colors sm:min-h-[64px] sm:text-lg ${
        active
          ? "border-violet bg-violet/20 text-ink"
          : "border-hair bg-bg-card/70 text-ink hover:border-violet/60 hover:bg-bg-card"
      }`}
    >
      {children}
    </button>
  );
}
