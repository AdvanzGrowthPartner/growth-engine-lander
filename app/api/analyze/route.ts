import { NextResponse } from "next/server";
import {
  analyzeHtml,
  emptySignals,
  isSafePublicUrl,
  normalizeUrl,
} from "@/lib/analysis";

export const runtime = "nodejs";

// Analiza una tienda desde afuera con su HTML público.
// POST { url } -> SiteSignals
export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const url = normalizeUrl(body.url ?? "");
  if (!url || !isSafePublicUrl(url)) {
    // No es una URL utilizable: devolvemos señales vacías (el scoring degrada al quiz).
    return NextResponse.json(emptySignals(url ?? body.url ?? ""));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const start = performance.now();
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // UA de navegador real para que las tiendas respondan el HTML completo.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const responseSeconds = Math.round(((performance.now() - start) / 1000) * 10) / 10;

    const finalUrl = res.url || url;
    const raw = await res.text();
    const html = raw.slice(0, 600_000); // cap defensivo

    const signals = analyzeHtml(finalUrl, html, res.headers, responseSeconds);
    return NextResponse.json(signals);
  } catch {
    // Timeout / DNS / red: degradamos a quiz-only sin inventar hallazgos.
    return NextResponse.json(emptySignals(url));
  } finally {
    clearTimeout(timeout);
  }
}
