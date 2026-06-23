import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Recibe el lead del diagnóstico y lo reenvía al webhook de GHL.
// La URL del webhook vive en GHL_WEBHOOK_URL (variable de entorno, secreta).
export async function POST(request: Request) {
  const webhook = process.env.GHL_WEBHOOK_URL;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body inválido" }, { status: 400 });
  }

  if (!webhook) {
    // Aún no configurado: no rompemos el flujo, solo avisamos en logs.
    console.warn("[lead] GHL_WEBHOOK_URL no configurado — lead no reenviado.");
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        source: "growth-engine-lander",
        receivedAt: new Date().toISOString(),
      }),
    });
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false, reason: "forward_failed" }, { status: 502 });
  }
}
