import { createHash } from "crypto";

// Meta Conversions API (server-side). Recupera conversiones que el Pixel del
// browser pierde (iOS, adblockers) y mejora el match quality (EMQ).
// Best-effort: si no hay credenciales o falla, no rompe el flujo del lead.

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

type CapiResult = {
  configured: boolean;
  ok: boolean;
  status?: number;
  error?: string;
};

export async function sendCapiLead(params: {
  email?: string;
  phone?: string;
  eventSourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
}): Promise<CapiResult> {
  const pixelId =
    process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const token = process.env.FB_CAPI_TOKEN;
  if (!pixelId || !token) return { configured: false, ok: false };

  const userData: Record<string, unknown> = {};
  if (params.email) userData.em = [sha256(params.email)];
  if (params.phone) userData.ph = [sha256(params.phone.replace(/\D/g, ""))];
  if (params.clientIp) userData.client_ip_address = params.clientIp;
  if (params.userAgent) userData.client_user_agent = params.userAgent;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: params.eventSourceUrl,
        user_data: userData,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { configured: true, ok: false, status: res.status, error: txt.slice(0, 200) };
    }
    return { configured: true, ok: true, status: res.status };
  } catch {
    return { configured: true, ok: false, error: "fetch_failed" };
  }
}
