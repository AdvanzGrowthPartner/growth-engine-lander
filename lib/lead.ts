// Envío del lead a GHL (vía nuestra API, que reenvía al webhook) + captura de UTMs.

export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ]) {
    const v = p.get(k);
    if (v) utm[k] = v;
  }
  return utm;
}

// Fire-and-forget: nunca bloquea ni rompe la UI si falla.
export async function sendLead(payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // silencioso: el resultado en pantalla no depende de esto.
  }
}
