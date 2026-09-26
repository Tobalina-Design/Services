import type { Metadata } from "next";
import "@fontsource/red-rose/300.css";
import "@fontsource/red-rose/400.css";
import "@fontsource/red-rose/500.css";
import "@fontsource/red-rose/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tobalina — Estudio de diseño e identidad",
  description:
    "No hacemos ruido. Hacemos identidad. Estudio de diseño de Beatriz Tobalina: identidad corporativa y bodas y eventos de alto nivel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
