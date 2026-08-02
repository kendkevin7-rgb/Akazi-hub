"use client";

import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-ink-100 bg-card/95">
      <div className="container-mobile flex flex-col items-center gap-3 px-4 py-5">
        <BrandMark size={32} />
        <nav className="flex items-center gap-4 text-xs font-semibold text-ink-600">
          <Link href="/legal/terms" className="tap-target underline-offset-2 hover:underline">
            {t("termsTitle")}
          </Link>
          <Link href="/legal/privacy" className="tap-target underline-offset-2 hover:underline">
            {t("privacyTitle")}
          </Link>
          <Link href="/legal/security" className="tap-target underline-offset-2 hover:underline">
            {t("securityTitle")}
          </Link>
        </nav>
        <p className="text-center text-[11px] text-ink-400">
          © {new Date().getFullYear()} {t("appName")} · Kigali, Rwanda
        </p>
      </div>
    </footer>
  );
}
