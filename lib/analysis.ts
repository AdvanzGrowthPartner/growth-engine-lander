import type { SiteSignals } from "@/types/diagnostic";

// Normaliza lo que escribe el usuario a una URL https válida.
// "tienda.cl" -> "https://tienda.cl" ; limpia espacios y barras.
export function normalizeUrl(raw: string): string | null {
  let s = (raw || "").trim();
  if (!s) return null;
  s = s.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  if (!s || !s.includes(".")) return null;
  return `https://${s}`;
}

// Guarda básica anti-SSRF: solo http(s) público, nada de localhost / IPs privadas.
export function isSafePublicUrl(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    host === "::1" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
  ) {
    return false;
  }
  return true;
}

const REVIEWS_APPS: [RegExp, string][] = [
  [/loox/i, "Loox"],
  [/judge\.?me/i, "Judge.me"],
  [/stamped/i, "Stamped"],
  [/okendo/i, "Okendo"],
  [/yotpo/i, "Yotpo"],
  [/reviews\.io|reviewsio/i, "Reviews.io"],
  [/opinew/i, "Opinew"],
  [/rivyo/i, "Rivyo"],
  [/trustpilot/i, "Trustpilot"],
];

const EMAIL_APPS: [RegExp, string][] = [
  [/klaviyo/i, "Klaviyo"],
  [/privy/i, "Privy"],
  [/omnisend/i, "Omnisend"],
  [/mailchimp|list-manage\.com/i, "Mailchimp"],
  [/attentive/i, "Attentive"],
  [/mailmunch/i, "MailMunch"],
  [/sumo\.com|sumome/i, "Sumo"],
];

function detectPlatform(html: string, headers: Headers): string | null {
  const h = html.toLowerCase();
  const server = (headers.get("x-shopify-stage") || headers.get("powered-by") || "").toLowerCase();
  if (server.includes("shopify") || h.includes("cdn.shopify.com") || h.includes("myshopify.com") || h.includes("shopify.theme"))
    return "Shopify";
  if (h.includes("woocommerce") || h.includes("wp-content")) return "WooCommerce";
  if (h.includes("mitiendanube") || h.includes("tiendanube")) return "Tiendanube";
  if (h.includes("vtex")) return "VTEX";
  if (h.includes("magento")) return "Magento";
  if (h.includes("wix.com")) return "Wix";
  return null;
}

// Interpreta el HTML + headers + timing en señales estructuradas.
export function analyzeHtml(
  url: string,
  html: string,
  headers: Headers,
  responseSeconds: number | null
): SiteSignals {
  const h = html.toLowerCase();

  const platform = detectPlatform(html, headers);

  const hasMetaPixel =
    h.includes("fbevents.js") ||
    h.includes("connect.facebook.net") ||
    /fbq\s*\(/.test(h);

  const hasGA =
    h.includes("googletagmanager.com") ||
    h.includes("google-analytics.com") ||
    /gtag\s*\(/.test(h);

  let reviewsApp: string | null = null;
  for (const [re, name] of REVIEWS_APPS) {
    if (re.test(h)) {
      reviewsApp = name;
      break;
    }
  }

  let emailApp: string | null = null;
  for (const [re, name] of EMAIL_APPS) {
    if (re.test(h)) {
      emailApp = name;
      break;
    }
  }

  const hasMobileViewport = /<meta[^>]+name=["']viewport["']/i.test(html);

  // Datos estructurados (JSON-LD) = señal de AI-readiness / PDPs para agentes.
  const hasSchema =
    /application\/ld\+json/i.test(html) || /itemtype=["']https?:\/\/schema\.org/i.test(html);

  return {
    ok: true,
    url,
    platform,
    isShopify: platform === "Shopify",
    hasMetaPixel,
    hasGA,
    hasReviewsApp: !!reviewsApp,
    reviewsApp,
    hasEmailApp: !!emailApp,
    emailApp,
    hasMobileViewport,
    hasSchema,
    isHttps: url.startsWith("https://"),
    responseSeconds,
  };
}

// Señales vacías cuando no se pudo analizar (URL caída, timeout, etc.).
export function emptySignals(url: string): SiteSignals {
  return {
    ok: false,
    url,
    platform: null,
    isShopify: false,
    hasMetaPixel: false,
    hasGA: false,
    hasReviewsApp: false,
    reviewsApp: null,
    hasEmailApp: false,
    emailApp: null,
    hasMobileViewport: false,
    hasSchema: false,
    isHttps: url.startsWith("https://"),
    responseSeconds: null,
  };
}
