import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Barlow, Oswald, Roboto_Slab, Nunito_Sans, Work_Sans, DM_Sans, Bitter, Archivo } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], preload: false, display: "swap", weight: ["400", "600", "700"] });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], preload: false, display: "swap" });
const robotoSlab = Roboto_Slab({ variable: "--font-roboto-slab", subsets: ["latin"], preload: false, display: "swap" });
const nunitoSans = Nunito_Sans({ variable: "--font-nunito-sans", subsets: ["latin"], preload: false, display: "swap" });
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], preload: false, display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], preload: false, display: "swap" });
const bitter = Bitter({ variable: "--font-bitter", subsets: ["latin"], preload: false, display: "swap" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], preload: false, display: "swap" });

export const metadata: Metadata = {
  title: "Kichinihub",
  description: "Khichini Hub - Where flavor meets convenience. Browse our menu and discover your next favorite dish!",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7ee" },
    { media: "(prefers-color-scheme: dark)", color: "#672c28" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} ${oswald.variable} ${robotoSlab.variable} ${nunitoSans.variable} ${workSans.variable} ${dmSans.variable} ${bitter.variable} ${archivo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
