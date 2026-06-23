import Image from "next/image";
import { CTAButton } from "@/components/landing/CTAButton";

// Nav minimalista: logo de Advanz + un acceso al diagnóstico (sin menú completo).
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hair/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" aria-label="Advanz Growth Partner — inicio">
          <Image
            src="/advanz-logo.png"
            alt="Advanz Growth Partner"
            width={1715}
            height={423}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </a>
        <CTAButton className="!min-h-[40px] !px-5 !py-2 text-sm">
          Mi Growth Score
        </CTAButton>
      </nav>
    </header>
  );
}
