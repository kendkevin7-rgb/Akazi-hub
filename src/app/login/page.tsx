"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2, Phone, ShieldCheck, Smartphone } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { apiWithCsrf } from "@/lib/auth-client";
import clsx from "clsx";

type Step = "phone" | "code";

const RESEND_SECONDS = 60;

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, loading, refresh } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!loading && user) router.replace("/profile");
  }, [loading, user, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  async function handleSendCode() {
    if (busy) return;
    setError(null);

    const digits = phone.replace(/[\s\-()]/g, "");
    if (!/^(\+?250)?0?7\d{8}$/.test(digits)) {
      setError(t("errInvalidPhone"));
      return;
    }

    setBusy(true);
    try {
      const res = await apiWithCsrf("/api/auth/request-otp", {
        body: { phoneNumber: digits, purpose: "LOGIN" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "RATE_LIMITED"
            ? t("errRateLimited")
            : data.error === "RESEND_TOO_SOON"
              ? t("errResendTooSoon")
              : t("errGeneric")
        );
        return;
      }
      setStep("code");
      setCode("");
      setDevCode(data.devCode);
      setCountdown(RESEND_SECONDS);
    } catch {
      setError(t("errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    if (busy || code.trim().length !== 6) return;
    setError(null);
    setBusy(true);
    try {
      const res = await apiWithCsrf("/api/auth/verify-otp", {
        body: { phoneNumber: phone, code: code.trim(), purpose: "LOGIN" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "OTP_INCORRECT" || data.error === "OTP_MAX_ATTEMPTS"
            ? t("errOtpIncorrect")
            : data.error === "OTP_EXPIRED"
              ? t("errOtpExpired")
              : t("errGeneric")
        );
        return;
      }
      await refresh();
      router.replace("/profile");
    } catch {
      setError(t("errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-2">
        <Link href="/" aria-label={t("back")} className="tap-target rounded-full text-ink-600 active:bg-ink-50">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-display text-lg font-extrabold text-ink-900">{t("loginTitle")}</h1>
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-white p-5">
        {step === "phone" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-50 p-2.5 text-brand-600">
                <Smartphone size={20} />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-ink-900">{t("loginTitle")}</h2>
                <p className="text-sm text-ink-400">{t("loginSubtitle")}</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-800">{t("phoneNumber")}</label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                placeholder="07XX XXX XXX"
                className="w-full rounded-xl2 border border-ink-100 bg-surface px-3 py-3 text-sm font-semibold text-ink-900 outline-none focus:border-brand-500"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl2 border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm font-semibold text-danger">
                {error}
              </p>
            )}

            <button
              onClick={handleSendCode}
              disabled={busy}
              className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:bg-ink-100 disabled:text-ink-400"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
              {busy ? t("processing") : t("sendCode")}
            </button>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-400">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand-500" />
              {t("secureNote")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-50 p-2.5 text-brand-600">
                <KeyRound size={20} />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-ink-900">{t("enterCode")}</h2>
                <p className="text-sm text-ink-400">
                  {t("enterCodeSubtitle")} <span className="font-bold text-ink-700">{phone}</span>
                </p>
              </div>
            </div>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder={t("otpPlaceholder")}
              className="w-full rounded-xl2 border border-ink-100 bg-surface px-3 py-3 text-center font-display text-2xl font-extrabold tracking-[0.4em] text-ink-900 outline-none focus:border-brand-500"
            />

            {devCode && (
              <div className="rounded-xl2 border border-amber-300 bg-amber-50 px-3 py-2.5 text-center">
                <p className="text-xs font-semibold text-amber-700">{t("devCodeHint")}</p>
                <p className="font-display text-2xl font-extrabold tracking-[0.3em] text-amber-800">{devCode}</p>
              </div>
            )}

            {error && (
              <p role="alert" className="rounded-xl2 border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm font-semibold text-danger">
                {error}
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={busy || code.trim().length !== 6}
              className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:bg-ink-100 disabled:text-ink-400"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              {busy ? t("processing") : t("verify")}
            </button>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                onClick={() => {
                  setStep("phone");
                  setError(null);
                }}
                className="text-sm font-bold text-brand-600"
              >
                {t("editNumber")}
              </button>
              <button
                onClick={handleSendCode}
                disabled={busy || countdown > 0}
                className={clsx("text-sm font-bold", countdown > 0 ? "text-ink-300" : "text-brand-600")}
              >
                {countdown > 0 ? `${t("resendIn")} ${countdown}${t("seconds")}` : t("resendCode")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
