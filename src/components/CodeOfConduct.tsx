"use client";

import { ShieldAlert, Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const RULE_KEYS = [
  "rule_1",
  "rule_2",
  "rule_3",
  "rule_4",
  "rule_5",
  "rule_6",
  "rule_7",
  "rule_8",
];

export default function CodeOfConduct({
  agreed,
  onAgreed,
}: {
  agreed: boolean;
  onAgreed: (v: boolean) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand-50 p-2.5 text-brand-600">
          <ShieldAlert size={20} />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-ink-900">{t("rulesTitle")}</h2>
          <p className="text-sm text-ink-400">{t("rulesIntro")}</p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {RULE_KEYS.map((key) => (
          <li key={key} className="flex items-start gap-2.5 rounded-xl2 border border-ink-100 bg-card px-3 py-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <Check size={12} strokeWidth={3} />
            </span>
            <p className="text-sm leading-relaxed text-ink-800">{t(key)}</p>
          </li>
        ))}
      </ul>

      <label className="flex items-start gap-2.5 rounded-xl2 border border-ink-100 bg-card p-3 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreed(e.target.checked)}
          className="tap-target mt-0.5 h-5 w-5 shrink-0 accent-brand-500"
        />
        <span>{t("rulesConsent")}</span>
      </label>
    </div>
  );
}
