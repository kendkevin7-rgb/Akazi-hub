"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import SkillSelector from "@/components/SkillSelector";
import NidVerification from "@/components/NidVerification";
import MomoConfig from "@/components/MomoConfig";
import { NEIGHBORHOODS } from "@/lib/mockData";
import type { MomoProvider, RateUnit, Skill } from "@/lib/types";
import clsx from "clsx";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);

  // Step 2
  const [skill, setSkill] = useState<Skill | null>(null);

  // Step 3
  const [nid, setNid] = useState("");
  const [nidVerified, setNidVerified] = useState(false);

  // Step 4
  const [momoProvider, setMomoProvider] = useState<MomoProvider | null>(null);
  const [momoNumber, setMomoNumber] = useState("");
  const [rate, setRate] = useState("");
  const [rateUnit, setRateUnit] = useState<RateUnit>("hour");

  const canProceed =
    (step === 1 &&
      fullName.trim().length > 1 &&
      phoneNumber.trim().length >= 9 &&
      neighborhood &&
      agreed &&
      dataConsent) ||
    (step === 2 && skill !== null) ||
    (step === 3 && nidVerified) ||
    (step === 4 && momoProvider !== null && momoNumber.trim().length >= 9 && rate.trim().length > 0);

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <CheckCircle2 size={52} className="text-brand-500" />
        <h1 className="font-display text-xl font-extrabold text-ink-900">{t("submitted")}</h1>
        <p className="max-w-xs text-sm text-ink-400">{t("submittedBody")}</p>
        <Link href="/" className="tap-target rounded-xl2 bg-brand-500 px-6 text-sm font-bold text-white">
          {t("backHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center gap-2">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            aria-label={t("back")}
            className="tap-target rounded-full text-ink-600 active:bg-ink-50"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <Link href="/" aria-label={t("back")} className="tap-target rounded-full text-ink-600 active:bg-ink-50">
            <ChevronLeft size={22} />
          </Link>
        )}
        <div>
          <h1 className="font-display text-lg font-extrabold text-ink-900">{t("onboardingTitle")}</h1>
          <p className="text-xs font-semibold text-ink-400">
            {t("onboardingStep")} {step} {t("of")} {TOTAL_STEPS}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={clsx("h-1.5 flex-1 rounded-full", i < step ? "bg-brand-500" : "bg-ink-100")}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-800">{t("fullName")}</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Kwizera Jean Baptiste"
              className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-800">{t("phoneNumber")}</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+250 7XX XXX XXX"
              className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-800">{t("neighborhood")}</label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
            >
              <option value="" disabled>
                {t("neighborhood")}
              </option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 rounded-xl2 border border-ink-100 bg-white p-3">
            <label className="flex items-start gap-2.5 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="tap-target mt-0.5 h-5 w-5 shrink-0 accent-brand-500"
              />
              <span>
                {t("consentLabel")} —{" "}
                <Link href="/legal/terms" className="font-bold text-brand-600 underline">
                  {t("termsTitle")}
                </Link>{" "}
                ·{" "}
                <Link href="/legal/privacy" className="font-bold text-brand-600 underline">
                  {t("privacyTitle")}
                </Link>
              </span>
            </label>
            <label className="flex items-start gap-2.5 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={dataConsent}
                onChange={(e) => setDataConsent(e.target.checked)}
                className="tap-target mt-0.5 h-5 w-5 shrink-0 accent-brand-500"
              />
              <span>{t("dataConsent")}</span>
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <label className="mb-1 block text-sm font-semibold text-ink-800">{t("selectSkills")}</label>
          <SkillSelector selected={skill} onSelect={setSkill} />
        </div>
      )}

      {step === 3 && (
        <NidVerification value={nid} onChange={setNid} verified={nidVerified} onVerified={setNidVerified} />
      )}

      {step === 4 && (
        <div className="space-y-5">
          <MomoConfig
            provider={momoProvider}
            onProvider={setMomoProvider}
            number={momoNumber}
            onNumber={setMomoNumber}
          />
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-800">{t("rateAmount")}</label>
            <input
              type="number"
              inputMode="numeric"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="3000"
              className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-800">{t("rateUnit")}</label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["hour", "day"] as RateUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setRateUnit(u)}
                  className={clsx(
                    "tap-target rounded-xl2 border-2 text-sm font-bold",
                    rateUnit === u ? "border-brand-500 bg-brand-50 text-brand-600" : "border-ink-100 bg-white text-ink-800"
                  )}
                >
                  {u === "hour" ? t("perHour") : t("perDay")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!canProceed}
        className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400"
      >
        {step < TOTAL_STEPS ? t("next") : t("submit")}
      </button>
    </div>
  );
}
