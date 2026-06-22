"use client";

import { useDiagnostic } from "@/components/diagnostic/DiagnosticProvider";

type CTAButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

// Botón reutilizable que abre el diagnóstico.
// El copy por defecto dice lo que el usuario RECIBE, nunca "Enviar".
export function CTAButton({
  children = "Quiero mi Growth Score",
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const { open } = useDiagnostic();

  const base =
    "inline-flex min-h-[48px] items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-100";

  const styles =
    variant === "primary"
      ? "bg-gradient-brand text-bg shadow-[0_8px_30px_rgba(193,93,255,0.25)]"
      : "border border-hair bg-bg-card/60 text-ink hover:border-violet/50";

  return (
    <button
      type="button"
      onClick={() => open()}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
