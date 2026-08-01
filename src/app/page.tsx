"use client";

import Link from "next/link";
import { Search as SearchIcon, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CategoryGrid from "@/components/CategoryGrid";
import WorkerCard from "@/components/WorkerCard";
import { WORKERS } from "@/lib/mockData";

export default function HomePage() {
  const { t } = useLanguage();

  const featured = [...WORKERS].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="space-y-6 pb-6">
      <section className="rounded-xl2 bg-brand-500 px-5 py-6 text-white">
        <h1 className="font-display text-2xl font-extrabold leading-tight">{t("heroTitle")}</h1>
        <p className="mt-1.5 text-sm text-brand-50">{t("heroSubtitle")}</p>

        <Link
          href="/search"
          className="tap-target mt-4 flex items-center gap-2 rounded-xl2 bg-white px-4 text-sm text-ink-400"
        >
          <SearchIcon size={18} />
          {t("searchPlaceholder")}
        </Link>
      </section>

      <section>
        <h2 className="mb-3 font-display text-base font-bold text-ink-900">{t("categories")}</h2>
        <CategoryGrid />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink-900">{t("featuredWorkers")}</h2>
          <Link href="/search" className="flex items-center text-sm font-bold text-brand-500">
            {t("seeAll")}
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {featured.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      </section>

      <Link
        href="/onboarding"
        className="tap-target block w-full rounded-xl2 border-2 border-dashed border-brand-300 bg-brand-50 text-sm font-bold text-brand-600"
      >
        {t("becomeWorker")}
      </Link>
    </div>
  );
}
