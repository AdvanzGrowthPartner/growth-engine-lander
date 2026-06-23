import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Poppins NO es variable font → hay que declarar los pesos que usamos.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Space Grotesk SÍ es variable font → no hace falta listar pesos.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Growth Engine™ — Descubre dónde está la fuga de tu ecommerce",
  description:
    "Deja la URL de tu tienda y recibe tu Growth Score en pantalla más un informe completo. Diagnóstico gratuito del Growth Engine de Advanz: 8 etapas para escalar tu ecommerce.",
  metadataBase: new URL("https://web.advanz.cl"),
  openGraph: {
    title: "Growth Engine™ — Tu Growth Score en 90 segundos",
    description:
      "El problema no es tu tráfico. Es que estás adivinando qué parte de tu ecommerce está rota. Descubre exactamente dónde está la fuga.",
    type: "website",
    locale: "es_LA",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${poppins.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-bg text-ink"
      >
        {children}
      </body>
    </html>
  );
}
