"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import WorkerCard from "@/components/WorkerCard";
import { WORKERS, SKILL_META } from "@/lib/mockData";
import type { Skill } from "@/lib/types";
import clsx from "clsx";

function SearchPageInner() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const initialSkill = (params.get("skill") as Skill | null) ?? null;

  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<Skill | null>(initialSkill);
  const [availableOnly, setAvailableOnly] = useState(false);

  const results = useMemo(() => {
    return WORKERS.filter((w) => {
      if (skillFilter && w.skill !== skillFilter) return false;
      if (availableOnly && !w.available) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${w.name} ${w.neighborhood} ${t(`skill_${w.skill}`)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.rating - a.rating);
  }, [query, skillFilter, availableOnly, t]);

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center gap-2 rounded-xl2 border border-ink-100 bg-white px-3">
        <SearchIcon size={18} className="text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="tap-target w-full bg-transparent text-sm text-ink-900 outline-none"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSkillFilter(null)}
          className={clsx(
            "tap-target shrink-0 rounded-full px-4 text-xs font-bold",
            skillFilter === null ? "bg-brand-500 text-white" : "bg-white text-ink-800 border border-ink-100"
          )}
        >
          {t("filterAll")}
        </button>
        {SKILL_META.map((s) => (
          <button
            key={s.key}
            onClick={() => setSkillFilter(s.key)}
            className={clsx(
              "tap-target shrink-0 rounded-full px-4 text-xs font-bold",
              skillFilter === s.key ? "bg-brand-500 text-white" : "bg-white text-ink-800 border border-ink-100"
            )}
          >
            {t(s.labelKey)}
          </button>
        ))}
      </div>

      <button
        onClick={() => setAvailableOnly((v) => !v)}
        className={clsx(
          "tap-target flex items-center gap-2 rounded-xl2 border px-3 text-xs font-bold",
          availableOnly ? "border-brand-500 bg-brand-50 text-brand-600" : "border-ink-100 bg-white text-ink-600"
        )}
      >
        <SlidersHorizontal size={14} />
        {t("filterAvailable")}
      </button>

      <p className="text-xs font-semibold text-ink-400">{results.length} results</p>

      <div className="space-y-3">
        {results.map((w) => (
          <WorkerCard key={w.id} worker={w} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
