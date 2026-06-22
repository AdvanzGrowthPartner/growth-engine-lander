// Footer simple.
export function Footer() {
  return (
    <footer className="border-t border-hair/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold tracking-tight text-ink">
            Advanz
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            Growth Engine
          </span>
        </div>
        <p className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} Advanz Growth Partner · advanz.cl
        </p>
        <a
          href="https://web.advanz.cl"
          className="font-mono text-xs uppercase tracking-widest text-ink-mute hover:text-ink"
        >
          web.advanz.cl
        </a>
      </div>
    </footer>
  );
}
