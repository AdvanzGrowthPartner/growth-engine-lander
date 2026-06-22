"use client";

import { useState } from "react";
import type { Lead } from "@/types/diagnostic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pantalla 7 — Gate: todo en una sola pantalla. Valida email antes de avanzar.
export function GateScreen({
  lead,
  needsUrl,
  onChange,
  onSubmit,
}: {
  lead: Lead;
  needsUrl: boolean;
  onChange: (field: keyof Lead, value: string) => void;
  onSubmit: () => void;
}) {
  const [touched, setTouched] = useState(false);

  const nameOk = lead.name.trim().length > 1;
  const emailOk = EMAIL_RE.test(lead.email.trim());
  const whatsappOk = lead.whatsapp.trim().length >= 6;
  const urlOk = !needsUrl || lead.url.trim().length > 2;
  const formOk = nameOk && emailOk && whatsappOk && urlOk;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (formOk) onSubmit();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink sm:text-3xl">
        Ya casi tenés tu resultado
      </h2>
      <p className="mt-2 text-ink-mute">
        Completá esto para ver tu diagnóstico y recibir el informe completo.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <Field
          label="Nombre"
          value={lead.name}
          onChange={(v) => onChange("name", v)}
          placeholder="Tu nombre"
          error={touched && !nameOk ? "Decinos tu nombre" : ""}
          autoFocus
        />
        <Field
          label="Email"
          type="email"
          value={lead.email}
          onChange={(v) => onChange("email", v)}
          placeholder="vos@tutienda.cl"
          error={touched && !emailOk ? "Ingresá un email válido" : ""}
        />
        <Field
          label="WhatsApp"
          type="tel"
          value={lead.whatsapp}
          onChange={(v) => onChange("whatsapp", v)}
          placeholder="+56 9 1234 5678"
          error={touched && !whatsappOk ? "Ingresá un WhatsApp válido" : ""}
        />
        {needsUrl && (
          <Field
            label="URL de tu tienda"
            value={lead.url}
            onChange={(v) => onChange("url", v)}
            placeholder="tutienda.cl"
            error={touched && !urlOk ? "Ingresá la URL de tu tienda" : ""}
          />
        )}

        <button
          type="submit"
          className="bg-gradient-brand mt-2 inline-flex min-h-[52px] items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-bg transition-transform duration-200 hover:scale-[1.02] active:scale-100 disabled:opacity-60"
        >
          Ver mi Growth Score
        </button>
        <p className="text-center font-mono text-xs text-ink-faint">
          Sin spam · solo tu informe
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-mute">
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`min-h-[52px] w-full rounded-xl2 border bg-bg-card/60 px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none ${
          error ? "border-red-400/70" : "border-hair focus:border-violet/60"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
