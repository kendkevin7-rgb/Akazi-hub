"use client";

import Link from "next/link";
import { Search as SearchIcon, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CategoryGrid from "@/components/CategoryGrid";
import WorkerCard from "@/components/WorkerCard";
import Reveal from "@/components/Reveal";
import { useWorkers } from "@/lib/useWorkers";
import { WORKERS } from "@/lib/mockData";

export default function HomePage() {
  const { t } = useLanguage();
  const { workers, loading } = useWorkers();

  const source = workers.length > 0 ? workers : WORKERS;
  const featured = [...source].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="space-y-6 pb-6">
      <Reveal>
        <section className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-6 text-white shadow-floating">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <h1 className="font-display text-2xl font-extrabold leading-tight">{t("heroTitle")}</h1>
          <p className="mt-1.5 text-sm text-brand-50">{t("heroSubtitle")}</p>

          <Link
            href="/search"
            className="tap-target mt-4 flex items-center gap-2 rounded-xl2 bg-card px-4 text-sm text-ink-400 shadow-sm"
          >
            <SearchIcon size={18} />
            {t("searchPlaceholder")}
          </Link>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <section>
          <h2 className="mb-3 font-display text-base font-bold text-ink-900">{t("categories")}</h2>
          <CategoryGrid />
        </section>
      </Reveal>

      <Reveal delay={160}>
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
      </Reveal>

      <Reveal delay={220}>
        <Link
          href="/onboarding"
          className="tap-target block w-full rounded-xl2 border-2 border-dashed border-brand-300 bg-brand-50 text-sm font-bold text-brand-600"
        >
          {t("becomeWorker")}
        </Link>
      </Reveal>
    </div>
  );
}
