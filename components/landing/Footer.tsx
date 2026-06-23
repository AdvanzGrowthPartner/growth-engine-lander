import Image from "next/image";

// Footer simple con el logo de Advanz.
export function Footer() {
  return (
    <footer className="border-t border-hair/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Image
          src="/advanz-logo.png"
          alt="Advanz Growth Partner"
          width={1715}
          height={423}
          className="h-6 w-auto"
        />
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
