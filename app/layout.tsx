import type { Metadata } from "next";
import "./globals.css";

// Las fuentes (Fredoka, Bricolage Grotesque, Baloo 2) se declaran en globals.css con @font-face:
// viven en public/fonts, con los caracteres latinos y latinos extendidos (ī, ḥ, ʿ…).

export const metadata: Metadata = {
  title: "Signos en juego — Semiótica, discurso y videojuegos",
  description:
    "Línea de tiempo interactiva de la semiótica, los estudios del discurso, la narratología y los game studies aplicados al desarrollo de videojuegos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
