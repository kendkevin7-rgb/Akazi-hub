"use client";

import { Smartphone } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { MomoProvider } from "@/lib/types";
import clsx from "clsx";

const PROVIDERS: { key: MomoProvider; label: string; color: string; bg: string; border: string }[] = [
  { key: "MTN_MOMO", label: "MTN MoMo", color: "text-[#C99400]", bg: "bg-[#FFF4D6]", border: "border-[#F5C518]" },
  { key: "AIRTEL_MONEY", label: "Airtel Money", color: "text-[#B23A2E]", bg: "bg-[#FCE7E4]", border: "border-[#E4544B]" },
];

export default function MomoConfig({
  provider,
  onProvider,
  number,
  onNumber,
}: {
  provider: MomoProvider | null;
  onProvider: (p: MomoProvider) => void;
  number: string;
  onNumber: (n: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-800">{t("momoProvider")}</label>
        <div className="grid grid-cols-2 gap-2.5">
          {PROVIDERS.map((p) => {
            const active = provider === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onProvider(p.key)}
                className={clsx(
                  "tap-target rounded-xl2 border-2 text-sm font-bold",
                  active ? `${p.border} ${p.bg} ${p.color}` : "border-ink-100 bg-card text-ink-800"
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-ink-800">{t("momoNumber")}</label>
        <div className="flex items-center gap-2 rounded-xl2 border border-ink-100 bg-surface px-3">
          <Smartphone size={18} className="text-ink-400" />
          <input
            type="tel"
            value={number}
            onChange={(e) => onNumber(e.target.value)}
            placeholder="+250 7XX XXX XXX"
            className="tap-target w-full bg-transparent text-sm text-ink-900 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
