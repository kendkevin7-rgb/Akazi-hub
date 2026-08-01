"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur">
      <div className="container-mobile flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="tap-target rounded-xl2 bg-brand-500 text-white" style={{ height: 40, width: 40 }}>
            <Hammer size={20} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            {t("appName")}
          </span>
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
}
