"use client";

import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import BrandMark from "@/components/BrandMark";
import { useLanguage } from "@/components/LanguageProvider";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-card/95 backdrop-blur">
      <div className="container-mobile flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            {t("appName")}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
