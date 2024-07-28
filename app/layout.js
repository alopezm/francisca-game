import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Donde todos los caminos terminan",
  description:
    "El videojuego se enmarca en la vida y muerte de Walter Benjamin a través de mecánicas de exploración y sigilo para descubrir de qué se trata la serie de sucesos en la que se encuentra inmerso dentro del mundo extraordinario en el que despierta.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
