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
    "a soft little translator across 100+ languages. no rush, no popups, just a cozy place to translate things ♡",
  keywords: ["translator", "language", "vocumi", "cozy", "translation"],
  manifest: "/site.webmanifest",
  applicationName: "Vocumi",
  appleWebApp: {
    capable: true,
    title: "Vocumi",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Vocumi — your cozy translator",
    description: "translate, take your time. 100+ languages, no rush ♡",
    type: "website",
    siteName: "Vocumi",
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
