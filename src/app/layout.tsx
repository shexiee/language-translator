import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Vocumi — your cozy translator",
  description:
    "Vocumi is your cozy companion for translating between 100+ languages. Warm, fast, and effortlessly elegant.",
  keywords: ["translator", "language", "vocumi", "cozy", "translation"],
  openGraph: {
    title: "Vocumi — your cozy translator",
    description: "Warm, fast translation across 100+ languages.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf2e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-grain">{children}</body>
    </html>
  );
}
