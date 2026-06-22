import { CTAButton } from "@/components/landing/CTAButton";

// Nav minimalista: solo logo + un acceso al diagnóstico (sin menú completo).
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hair/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold tracking-tight text-ink">
            Advanz
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
            Growth Engine
          </span>
        </a>
        <CTAButton className="!min-h-[40px] !px-5 !py-2 text-sm">
          Mi Growth Score
        </CTAButton>
      </nav>
    </header>
  );
}
