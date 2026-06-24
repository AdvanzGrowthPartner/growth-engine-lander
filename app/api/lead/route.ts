import { NextResponse } from "next/server";
import { questions } from "@/lib/questions";
import { sendCapiLead } from "@/lib/capi";
import {
  createOpportunity,
  ensureCustomFields,
  getPipelineStage,
  upsertContact,
} from "@/lib/ghl";

export const runtime = "nodejs";

// Custom fields del diagnóstico (se crean en GHL si no existen).
const FIELD_SPECS = [
  { name: "Growth Score", dataType: "NUMERICAL" },
  { name: "Nivel", dataType: "TEXT" },
  { name: "Pérdida estimada (USD/mes)", dataType: "TEXT" },
  { name: "Facturación mensual", dataType: "TEXT" },
  { name: "Inversión en ads", dataType: "TEXT" },
  { name: "Claridad de oferta", dataType: "TEXT" },
  { name: "Retención", dataType: "TEXT" },
  { name: "Decisiones", dataType: "TEXT" },
  { name: "Fugas urgentes", dataType: "LARGE_TEXT" },
  { name: "UTM Source", dataType: "TEXT" },
  { name: "UTM Campaign", dataType: "TEXT" },
];

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
  const pipelineName = process.env.GHL_PIPELINE_NAME || "Pipeline Advanz";
  const stageName = process.env.GHL_PIPELINE_STAGE || "Nuevo Prospecto";

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
    const fieldMap = await ensureCustomFields(token, locationId, FIELD_SPECS);
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

    const tipo = body.leadType === "tibio" ? "tibio" : "caliente";
    const up = await upsertContact(token, locationId, {
      firstName: (body.name as string) || "",
      email: (body.email as string) || "",
      phone: (body.whatsapp as string) || "",
      website: (body.url as string) || "",
      source: (body.source as string) || "growth-engine-lander",
      tags: ["diagnostico", tipo],
      customFields,
    });

    let opportunityCreated = false;
    if (up.contactId) {
      const stage = await getPipelineStage(
        token,
        locationId,
        pipelineName,
        stageName
      );
      if (stage?.pipelineId) {
        const opp = await createOpportunity(token, locationId, {
          pipelineId: stage.pipelineId,
          pipelineStageId: stage.stageId,
          contactId: up.contactId,
          name: `${(body.url as string) || "Sin URL"} | ${(body.name as string) || "Lead"} | Diagnóstico`,
          status: "open",
        });
        opportunityCreated = opp.ok;
      }
    }

    // Meta CAPI (server-side) — best-effort.
    await sendCapiLead({
      email: body.email as string,
      phone: body.whatsapp as string,
      eventSourceUrl: body.pageUrl as string,
      clientIp: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      ok: up.ok,
      contactId: up.contactId,
      customFieldsSent: customFields.length,
      opportunityCreated,
    });
  } catch {
    return NextResponse.json({ ok: false, reason: "ghl_failed" }, { status: 502 });
  }
}
