// Cliente mínimo de la API de GoHighLevel (v2).
// Crea/actualiza el contacto con sus custom fields y abre la oportunidad
// en el pipeline. Auth con un Private Integration Token (server-side).

const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Version: VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

type CustomField = { id: string; name: string };
type Stage = { id: string; name: string };
type Pipeline = { id: string; name: string; stages?: Stage[] };

// Caches a nivel de módulo (se resetean en cada redeploy / cold start).
let fieldCache: Record<string, string> | null = null;
let stageCache: { pipelineId: string; stageId?: string } | null = null;

// Mapa nombre-de-campo (en minúsculas) → id.
export async function getCustomFieldMap(
  token: string,
  locationId: string
): Promise<Record<string, string>> {
  if (fieldCache) return fieldCache;
  const res = await fetch(`${BASE}/locations/${locationId}/customFields`, {
    headers: headers(token),
  });
  if (!res.ok) return {};
  const data = (await res.json()) as { customFields?: CustomField[] };
  const map: Record<string, string> = {};
  for (const f of data.customFields ?? []) map[f.name.toLowerCase()] = f.id;
  fieldCache = map;
  return map;
}

// Encuentra el pipeline y la etapa por nombre (o usa el primero).
export async function getPipelineStage(
  token: string,
  locationId: string,
  pipelineName: string,
  stageName: string
): Promise<{ pipelineId: string; stageId?: string } | null> {
  if (stageCache) return stageCache;
  const res = await fetch(
    `${BASE}/opportunities/pipelines?locationId=${locationId}`,
    { headers: headers(token) }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { pipelines?: Pipeline[] };
  const pipelines = data.pipelines ?? [];
  const pipeline =
    pipelines.find((p) => p.name.toLowerCase() === pipelineName.toLowerCase()) ??
    pipelines[0];
  if (!pipeline) return null;
  const stage =
    (pipeline.stages ?? []).find(
      (s) => s.name.toLowerCase() === stageName.toLowerCase()
    ) ?? (pipeline.stages ?? [])[0];
  stageCache = { pipelineId: pipeline.id, stageId: stage?.id };
  return stageCache;
}

type UpsertResult = { ok: boolean; contactId: string | null; status: number };

export async function upsertContact(
  token: string,
  locationId: string,
  payload: Record<string, unknown>
): Promise<UpsertResult> {
  const res = await fetch(`${BASE}/contacts/upsert`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ locationId, ...payload }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    contact?: { id?: string };
    id?: string;
  };
  return {
    ok: res.ok,
    contactId: data.contact?.id ?? data.id ?? null,
    status: res.status,
  };
}

export async function createOpportunity(
  token: string,
  locationId: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(`${BASE}/opportunities/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ locationId, ...payload }),
  });
  return { ok: res.ok, status: res.status };
}
