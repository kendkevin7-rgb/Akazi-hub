"use client";

import { useState } from "react";
import { BadgeCheck, Loader2, IdCard } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { isValidRwandaNid } from "@/lib/nid";

export default function NidVerification({
  value,
  onChange,
  verified,
  onVerified,
}: {
  value: string;
  onChange: (v: string) => void;
  verified: boolean;
  onVerified: (v: boolean) => void;
}) {
  const { t } = useLanguage();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleVerify() {
    setError(null);
    setChecking(true);
    onVerified(false);
    setTimeout(() => {
      setChecking(false);
      if (isValidRwandaNid(value)) {
        onVerified(true);
      } else {
        setError(t("nidHint"));
      }
    }, 600);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-ink-800">{t("nidNumber")}</label>
      <div
        className={`flex items-center gap-2 rounded-xl2 border bg-surface px-3 ${
          error ? "border-danger" : "border-ink-100"
        }`}
      >
        <IdCard size={18} className="text-ink-400" />
        <input
          inputMode="numeric"
          maxLength={16}
          value={value}
          onChange={(e) => {
            onChange(e.target.value.replace(/\D/g, ""));
            onVerified(false);
            setError(null);
          }}
          placeholder="1 199 8XXXXXXXXXX"
          className="tap-target w-full bg-transparent text-sm text-ink-900 outline-none"
        />
      </div>
      <p className={`mt-1 text-xs ${error ? "text-danger" : "text-ink-400"}`}>
        {error ?? t("nidHint")}
      </p>

      {verified ? (
        <div className="mt-2 flex items-center gap-2 rounded-xl2 bg-brand-50 px-3 py-2.5 text-sm font-bold text-brand-600">
          <BadgeCheck size={18} />
          {t("verifiedSuccess")}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleVerify}
          disabled={checking || value.length === 0}
          className="tap-target mt-2 w-full rounded-xl2 border-2 border-brand-500 text-sm font-bold text-brand-600 active:bg-brand-50 disabled:cursor-not-allowed disabled:border-ink-100 disabled:text-ink-400"
        >
          {checking ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              {t("verifying")}
            </span>
          ) : (
            t("verifyNid")
          )}
        </button>
      )}
    </div>
  );
}
