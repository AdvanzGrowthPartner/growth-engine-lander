import { NextResponse } from "next/server";
import { questions } from "@/lib/questions";
import {
  createOpportunity,
  getCustomFieldMap,
  getPipelineStage,
  upsertContact,
} from "@/lib/ghl";

export const runtime = "nodejs";

// Devuelve el texto de la opción elegida (ej. "$5.000 – $15.000 USD").
function labelFor(key: string, score: number | undefined): string {
  if (score == null) return "";
  const q = questions.find((q) => q.key === key);
  return q?.options.find((o) => o.score === score)?.label ?? "";
}

// Recibe el lead del diagnóstico y lo crea en GHL (contacto + pipeline) vía API.
export async function POST(request: Request) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  const pipelineName = process.env.GHL_PIPELINE_NAME || "Growth Engine";
  const stageName = process.env.GHL_PIPELINE_STAGE || "Nuevo diagnóstico";

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body inválido" }, { status: 400 });
  }

  if (!token || !locationId) {
    console.warn("[lead] GHL_API_TOKEN / GHL_LOCATION_ID no configurados.");
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }

  try {
    const fieldMap = await getCustomFieldMap(token, locationId);
    const cf = (name: string, value: unknown) => {
      const id = fieldMap[name.toLowerCase()];
      return id && value != null && value !== ""
        ? [{ id, field_value: String(value) }]
        : [];
    };

    const ans = (body.respuestas ?? {}) as Record<string, number>;
    const loss = body.loss as { low: number; high: number } | null;
    const lossStr = loss ? `US$${loss.low}–${loss.high}/mes` : "";
    const gaps = (body.gaps ?? []) as { area: string }[];
    const fugas = gaps.map((g) => g.area).join(", ");
    const utm = (body.utm ?? {}) as Record<string, string>;

    const customFields = [
      ...cf("Growth Score", body.score),
      ...cf("Nivel", body.level),
      ...cf("Pérdida estimada (USD/mes)", lossStr),
      ...cf("Facturación mensual", labelFor("facturacion", ans.facturacion)),
      ...cf("Inversión en ads", labelFor("ads", ans.ads)),
      ...cf("Claridad de oferta", labelFor("oferta", ans.oferta)),
      ...cf("Retención", labelFor("retencion", ans.retencion)),
      ...cf("Decisiones", labelFor("decision", ans.decision)),
      ...cf("Fugas urgentes", fugas),
      ...cf("UTM Source", utm.utm_source),
      ...cf("UTM Campaign", utm.utm_campaign),
    ];

    const up = await upsertContact(token, locationId, {
      firstName: (body.name as string) || "",
      email: (body.email as string) || "",
      phone: (body.whatsapp as string) || "",
      website: (body.url as string) || "",
      source: "growth-engine-lander",
      tags: ["diagnostico"],
      customFields,
    });

    if (up.contactId) {
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
          contactId: up.contactId,
          name: `${(body.name as string) || "Lead"} · ${(body.url as string) || ""}`.trim(),
          status: "open",
        });
      }
    }

    return NextResponse.json({ ok: up.ok });
  } catch {
    return NextResponse.json({ ok: false, reason: "ghl_failed" }, { status: 502 });
  }
}
