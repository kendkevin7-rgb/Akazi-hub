import type { Metadata, Viewport } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akazi Hub — Vetted technicians & domestic workers in Rwanda",
  description:
    "Akazi Hub connects Kigali households with NID-verified plumbers, electricians, cleaners, painters, and masons. Hire and pay via Mobile Money.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F6B5C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="font-body">
        <LanguageProvider>
          <div className="min-h-screen bg-surface pb-20">
            <Header />
            <main className="container-mobile px-4 pt-4">{children}</main>
            <Footer />
            <WhatsAppButton />
            <BottomNav />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
