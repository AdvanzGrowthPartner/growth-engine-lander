// Capa central de tracking (cliente). Un solo lugar que dispara los eventos
// a Meta Pixel, GA4 y dataLayer (GTM). Los cambios estéticos no la tocan.

type TrackEvent = "StartDiagnostic" | "Lead" | "Schedule";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Meta Pixel — Lead y Schedule son eventos estándar; el resto, custom.
  if (typeof window.fbq === "function") {
    if (event === "Lead" || event === "Schedule") {
      window.fbq("track", event, data);
    } else {
      window.fbq("trackCustom", event, data);
    }
  }

  // GA4
  if (typeof window.gtag === "function") {
    window.gtag("event", event, data);
  }

  // dataLayer (por si más adelante usás GTM)
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...data });
  }
}
