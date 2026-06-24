"use client";

import { useState } from "react";
import { getUtmParams, sendLead } from "@/lib/lead";
import { track } from "@/lib/tracking";

const GHL_CALENDAR_URL =
  "https://web.advanz.cl/widget/booking/t9l81TCLLeZ0sr3z4Aoa";

// Doble destino CTA: calendario GHL (hot lead) + form mail (warm lead).
// El calendario se expande inline — sin salir de la página.
export function BookingSection() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "sent">("idle");
  const [email, setEmail] = useState("");
  const [shopUrl, setShopUrl] = useState("");

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Lead tibio (no hizo el diagnóstico) → cae en el pipeline de GHL.
    sendLead({
      email,
      url: shopUrl,
      leadType: "tibio",
      source: "booking-form",
      utm: getUtmParams(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
    track("Lead", { leadType: "tibio" });
    setFormState("sent");
  }

  return (
    <div className="glass relative overflow-hidden rounded-xl3 p-10 text-center sm:p-14">
      {/* Glow ambiental */}
      <div className="glow-violet pointer-events-none absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 opacity-50" />

      <div className="relative">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Descubre dónde está la fuga{" "}
          <span className="text-gradient">en tu ecommerce</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-mute">
          30 minutos con un especialista de Advanz. Sin presión, sin pitch.
          Solo el diagnóstico honesto de tu negocio.
        </p>

        {/* CTA primario: calendario GHL */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() =>
              setCalendarOpen((v) => {
                if (!v) track("Schedule");
                return !v;
              })
            }
            className="bg-gradient-brand inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-8 py-3 text-base font-semibold text-bg shadow-[0_8px_30px_rgba(193,93,255,0.3)] transition-transform duration-200 hover:scale-[1.02] active:scale-100"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                clipRule="evenodd"
              />
            </svg>
            Agendar mi sesión 1:1
          </button>
        </div>

        {/* Calendario GHL embebido — se expande al hacer clic */}
        {calendarOpen && (
          <div className="mt-6 overflow-hidden rounded-xl2 border border-hair">
            <iframe
              src={GHL_CALENDAR_URL}
              title="Agendar diagnóstico Growth Engine"
              className="h-[600px] w-full bg-white"
              loading="lazy"
              allow="payment"
            />
          </div>
        )}

        {/* Divisor */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-hair" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            o si prefieres
          </span>
          <div className="h-px flex-1 bg-hair" />
        </div>

        {/* CTA secundario: form mail */}
        {formState === "idle" ? (
          <div className="mx-auto max-w-md">
            <p className="mb-4 text-sm text-ink-mute">
              Déjanos tu mail y la URL de tu tienda y te enviamos el Diagnóstico
              Growth Engine por correo.
            </p>
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="min-h-[48px] w-full rounded-full border border-hair bg-bg-card/70 px-5 py-3 text-ink placeholder:text-ink-faint focus:border-violet/60 focus:outline-none"
              />
              <div className="relative">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-faint">
                  https://
                </span>
                <input
                  type="text"
                  inputMode="url"
                  required
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  placeholder="tutienda.cl"
                  className="min-h-[48px] w-full rounded-full border border-hair bg-bg-card/70 py-3 pl-[5.5rem] pr-5 text-ink placeholder:text-ink-faint focus:border-violet/60 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-violet/40 bg-bg-card/60 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-violet/70 hover:text-violet"
              >
                Quiero mi diagnóstico por mail
              </button>
            </form>
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-xl2 border border-cyan/30 bg-cyan/5 p-6">
            <p className="font-semibold text-ink">
              Listo — te enviamos el diagnóstico en las próximas horas.
            </p>
            <p className="mt-1 text-sm text-ink-mute">
              Revisa tu bandeja de entrada (y el spam, por las dudas).
            </p>
          </div>
        )}

        {/* Objection handling */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["Sin tarjeta", "Sin compromiso", "Resultado en 24 hs"].map((o) => (
            <span
              key={o}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-faint"
            >
              <svg
                viewBox="0 0 20 20"
                className="h-3.5 w-3.5 text-cyan"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {o}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
