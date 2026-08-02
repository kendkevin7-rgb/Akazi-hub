"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, FileCheck2, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { apiWithCsrf } from "@/lib/auth-client";
import SkillSelector from "@/components/SkillSelector";
import NidVerification from "@/components/NidVerification";
import MomoConfig from "@/components/MomoConfig";
import DocumentUpload from "@/components/DocumentUpload";
import PhotoUpload from "@/components/PhotoUpload";
import CodeOfConduct from "@/components/CodeOfConduct";
import { NEIGHBORHOODS } from "@/lib/mockData";
import type { MomoProvider, RateUnit, Skill } from "@/lib/types";
import clsx from "clsx";

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  const [photoFileName, setPhotoFileName] = useState<string | undefined>(undefined);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);

  // Step 2
  const [rulesAgreed, setRulesAgreed] = useState(false);

  // Step 3
  const [skill, setSkill] = useState<Skill | null>(null);

  // Step 4
  const [nid, setNid] = useState("");
  const [nidVerified, setNidVerified] = useState(false);

  // Step 5
  const [cvReady, setCvReady] = useState(false);
  const [certReady, setCertReady] = useState(false);
  const [cvFileName, setCvFileName] = useState<string | undefined>(undefined);
  const [certFileName, setCertFileName] = useState<string | undefined>(undefined);

  // Step 6
  const [momoProvider, setMomoProvider] = useState<MomoProvider | null>(null);
  const [momoNumber, setMomoNumber] = useState("");
  const [rate, setRate] = useState("");
  const [rateUnit, setRateUnit] = useState<RateUnit>("hour");

  const canProceed =
    (step === 1 &&
      fullName.trim().length > 1 &&
      phoneNumber.trim().length >= 9 &&
      neighborhood &&
      photoReady &&
      agreed &&
      dataConsent) ||
    (step === 2 && rulesAgreed) ||
    (step === 3 && skill !== null) ||
    (step === 4 && nidVerified) ||
    (step === 5 && cvReady && certReady) ||
    (step === 6 && momoProvider !== null && momoNumber.trim().length >= 9 && rate.trim().length > 0);

  function handleNext() {
    setSubmitError(null);
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      void submitApplication();
    }
  }

  async function submitApplication() {
    if (!user) {
      setSubmitError("PLEASE_SIGN_IN");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiWithCsrf("/api/worker/apply", {
        body: {
          fullName,
          neighborhood,
          skill,
          nidNumber: nid,
          momoProvider,
          momoNumber,
          rateRwf: Number(rate),
          rateUnit,
          photoFileName,
          photoDataUrl,
          cvFileName,
          certFileName,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error === "ALREADY_VERIFIED" ? "ALREADY_VERIFIED" : "GENERIC");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("GENERIC");
    } finally {
      setSubmitting(false);
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
          <PhotoUpload onChange={(ready, name, dataUrl) => {
            setPhotoReady(ready);
            setPhotoFileName(name);
            setPhotoDataUrl(dataUrl);
          }} />
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

          <div className="space-y-3 rounded-xl2 border border-ink-100 bg-card p-3">
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

      {step === 2 && <CodeOfConduct agreed={rulesAgreed} onAgreed={setRulesAgreed} />}

      {step === 3 && (
        <div className="space-y-3">
          <label className="mb-1 block text-sm font-semibold text-ink-800">{t("selectSkills")}</label>
          <SkillSelector selected={skill} onSelect={setSkill} />
        </div>
      )}

      {step === 4 && (
        <NidVerification value={nid} onChange={setNid} verified={nidVerified} onVerified={setNidVerified} />
      )}

      {step === 5 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-50 p-2.5 text-brand-600">
              <FileCheck2 size={20} />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink-900">{t("documentsTitle")}</h2>
              <p className="text-sm text-ink-400">{t("documentsHint")}</p>
            </div>
          </div>
          <DocumentUpload label={t("cvLabel")} hint={t("uploadHint")} onChange={(ready, name) => {
            setCvReady(ready);
            setCvFileName(name);
          }} />
          <DocumentUpload label={t("certLabel")} hint={t("uploadHint")} onChange={(ready, name) => {
            setCertReady(ready);
            setCertFileName(name);
          }} />
        </div>
      )}

      {step === 6 && (
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
                    rateUnit === u ? "border-brand-500 bg-brand-50 text-brand-600" : "border-ink-100 bg-card text-ink-800"
                  )}
                >
                  {u === "hour" ? t("perHour") : t("perDay")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl2 border border-danger/20 bg-danger/10 px-3 py-3 text-sm font-semibold text-danger"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            {submitError === "PLEASE_SIGN_IN" ? (
              <>
                {t("submitSignIn")}{" "}
                <Link href="/login" className="font-bold underline">
                  {t("signIn")}
                </Link>
              </>
            ) : submitError === "ALREADY_VERIFIED" ? (
              t("alreadyVerified")
            ) : (
              t("errGeneric")
            )}
          </span>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!canProceed || submitting}
        className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {t("processing")}
          </span>
        ) : step < TOTAL_STEPS ? (
          t("next")
        ) : (
          t("submit")
        )}
      </button>
    </div>
  );
}
