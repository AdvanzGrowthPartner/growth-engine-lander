import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

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
    "Deja la URL de tu tienda y recibe tu Growth Score en pantalla más un informe completo. Diagnóstico del Growth Engine de Advanz: 8 etapas para escalar tu ecommerce.",
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
        <Analytics />
        <SpeedInsights />

        {FB_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}

        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
