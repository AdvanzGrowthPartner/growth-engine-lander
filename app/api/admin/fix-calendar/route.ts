import { NextResponse } from "next/server";

// Endpoint temporal — actualiza los colores del calendario GHL para que el
// texto en los inputs sea visible. Llamar UNA vez desde el browser, luego
// borrar este archivo.
//
// Llamar: GET https://landeradvanz.vercel.app/api/admin/fix-calendar

const BASE = "https://services.leadconnectorhq.com";
const CALENDAR_ID = "t9l81TCLLeZ0sr3z4Aoa";

export async function GET() {
  const token = process.env.GHL_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GHL_API_TOKEN no configurado" }, { status: 500 });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: "2021-04-15",
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Primero obtenemos el calendario actual para ver su estructura
  const getRes = await fetch(`${BASE}/calendars/${CALENDAR_ID}`, { headers });
  const current = await getRes.json();

  // Intentamos actualizar los estilos del widget
  const updateRes = await fetch(`${BASE}/calendars/${CALENDAR_ID}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      ...current.calendar,
      widgetType: current.calendar?.widgetType ?? "default",
      widgetSlug: current.calendar?.slug ?? CALENDAR_ID,
      widgetStyles: {
        ...(current.calendar?.widgetStyles ?? {}),
        // Texto oscuro en los inputs
        primaryCustom: "#7c3aed",
        ctaCustom: "#7c3aed",
        fontColor: "#111111",
        bgColor: "#ffffff",
        inputBgColor: "#ffffff",
        inputTextColor: "#111111",
        labelColor: "#374151",
      },
    }),
  });

  const updateData = await updateRes.json();

  return NextResponse.json({
    getStatus: getRes.status,
    updateStatus: updateRes.status,
    currentWidgetStyles: current.calendar?.widgetStyles,
    updateResult: updateData,
  });
}
