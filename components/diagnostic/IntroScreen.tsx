// Pantalla 0 — Intro: arranque con la URL (si la dejó) y expectativa de tiempo.
export function IntroScreen({
  url,
  onStart,
}: {
  url: string;
  onStart: () => void;
}) {
  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Growth Score
      </p>
      <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
        {url ? (
          <>
            Vamos a analizar{" "}
            <span className="text-gradient break-all">{url}</span>
          </>
        ) : (
          <>Vamos a analizar tu ecommerce</>
        )}
      </h2>
      <p className="mt-4 text-ink-mute">
        Son 6 pasos rápidos · te toma{" "}
        <span className="font-semibold text-ink">~90 segundos</span>. Al final
        ves tu Growth Score en pantalla y te mandamos el informe completo.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="bg-gradient-brand mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-bg transition-transform duration-200 hover:scale-[1.02] active:scale-100 sm:w-auto"
      >
        Empezar
      </button>
    </div>
  );
}
