import { NextRequest, NextResponse } from "next/server";
import { createOpportunity, getPipelineStage } from "@/lib/ghl";

export const runtime = "nodejs";

// Webhook entrante de GHL — se dispara cuando alguien completa una reserva
// en el calendario. Crea la oportunidad en el pipeline sin costo adicional
// (este endpoint es el que recibe; el webhook saliente lo configura GHL).
//
// Para configurar en GHL:
//   Settings → Integrations → Webhooks → Add New
//   URL: https://landeradvanz.vercel.app/api/appointment
//   Events: AppointmentCreate
export async function POST(req: NextRequest) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  const pipelineName = process.env.GHL_PIPELINE_NAME || "Pipeline Advanz";
  const stageName = process.env.GHL_PIPELINE_STAGE || "Nuevo Prospecto";

  // Siempre 200 — GHL reintenta en errores 5xx y no queremos loops.
  if (!token || !locationId) {
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_body" });
  }

  // GHL puede enviar múltiples tipos de evento al mismo webhook.
  // Solo nos interesa la creación de cita.
  const type = (body.type as string) || "";
  if (!type.toLowerCase().includes("appointment")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const contact = (body.contact ?? {}) as Record<string, string>;
    // GHL puede mandar el contactId en body.contactId o dentro de body.contact.id
    const contactId =
      (contact.id as string) ||
      (body.contactId as string) ||
      (body.id as string);

    const firstName = contact.firstName || "";
    const lastName = contact.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Prospecto";

    if (!contactId) {
      console.warn("[appointment] Payload sin contactId:", JSON.stringify(body).slice(0, 500));
      return NextResponse.json({ ok: false, reason: "no_contact_id" });
    }

    const stage = await getPipelineStage(
      token,
      locationId,
      pipelineName,
      stageName
    );

    if (stage?.pipelineId) {
      await createOpportunity(token, locationId, {
        pipelineId: stage.pipelineId,
        pipelineStageId: stage.stageId,
        contactId,
        name: `${fullName} | Agenda GE`,
        status: "open",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[appointment webhook]", err);
    return NextResponse.json({ ok: false, reason: "internal" });
  }
}
