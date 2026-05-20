import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "TravelVYP",
    template: "%s | TravelVYP",
  },
  description: "Sistema operativo para agencias de viajes — Constructor de itinerarios y experiencias premium.",
  keywords: ["agencia de viajes", "itinerario", "Orlando", "Disney", "viajes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
