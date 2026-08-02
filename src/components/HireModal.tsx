"use client";

import { useState } from "react";
import { X, Smartphone, Loader2, CheckCircle2, Phone, MessageCircle, Mail, Copy, Check } from "lucide-react";
import type { Worker } from "@/lib/types";
import { useLanguage } from "@/components/LanguageProvider";
import { telLink, whatsappLink } from "@/lib/contact";
import { PLATFORM_PHONE, COMMISSION_RATE, platformFee, workerReceives } from "@/lib/payments";

type Step = "form" | "processing" | "ussd" | "confirmed";

const DEPOSIT_RWF = 2000;

export default function HireModal({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("form");
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  const canSubmit = task.trim().length > 2 && date && time && phone.trim().length >= 9;

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(PLATFORM_PHONE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function handlePay() {
    setStep("processing");
    // Simulated USSD push — in production this calls the MoMo/Airtel Money collections API.
    setTimeout(() => setStep("ussd"), 1200);
    setTimeout(() => setStep("confirmed"), 3400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center">
      <div className="flex min-h-[55vh] w-full max-w-md flex-col overflow-y-auto rounded-t-xl2 bg-card p-5 sm:min-h-0 sm:rounded-xl2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">
            {t("hireTitle")} {worker.name}
          </h2>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="tap-target rounded-full text-ink-400 active:bg-ink-50"
          >
            <X size={22} />
          </button>
        </div>

        {step === "form" && (
          <div className="space-y-4">
            <div className="rounded-xl2 bg-surface p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
                {t("reachWorker")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={telLink(worker.momoNumber)}
                  className="tap-target flex items-center justify-center gap-1.5 rounded-xl2 bg-brand-500 px-3 py-2 text-xs font-bold text-white active:bg-brand-600"
                >
                  <Phone size={14} /> {t("call")}
                </a>
                <a
                  href={whatsappLink(worker.momoNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target flex items-center justify-center gap-1.5 rounded-xl2 bg-[#25D366] px-3 py-2 text-xs font-bold text-white active:opacity-90"
                >
                  <MessageCircle size={14} /> {t("whatsapp")}
                </a>
              </div>
              <p className="mt-2 text-center text-xs font-semibold text-ink-500">{worker.momoNumber}</p>
              {worker.email && (
                <a
                  href={`mailto:${worker.email}`}
                  className="tap-target mt-2 flex items-center justify-center gap-1.5 rounded-xl2 border border-ink-100 bg-card px-3 py-2 text-xs font-bold text-ink-700 active:bg-ink-50"
                >
                  <Mail size={14} /> {t("email")}: {worker.email}
                </a>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-800">
                {t("describeTask")}
              </label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder={t("describeTaskPlaceholder")}
                rows={3}
                className="w-full rounded-xl2 border border-ink-100 bg-surface px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink-800">
                  {t("chooseDate")}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink-800">
                  {t("chooseTime")}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-800">
                {t("yourPhone")}
              </label>
              <div className="flex items-center gap-2 rounded-xl2 border border-ink-100 bg-surface px-3">
                <Smartphone size={18} className="text-ink-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 7XX XXX XXX"
                  className="tap-target w-full bg-transparent text-sm text-ink-900 outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl2 border border-gold-400/30 bg-gold-400/10 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink-800">{t("depositLabel")}</span>
                <span className="font-display font-extrabold text-ink-900">
                  {DEPOSIT_RWF.toLocaleString()} RWF
                </span>
              </div>
              <div className="mt-2 space-y-1 border-t border-gold-400/20 pt-2 text-xs text-ink-600">
                <div className="flex justify-between">
                  <span>{t("platformFee")} ({(COMMISSION_RATE * 100).toFixed(0)}%)</span>
                  <span className="font-semibold text-danger">− {platformFee(DEPOSIT_RWF).toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between font-semibold text-ink-800">
                  <span>{t("workerReceives")}</span>
                  <span>{workerReceives(DEPOSIT_RWF).toLocaleString()} RWF</span>
                </div>
              </div>
              <div className="mt-3 rounded-xl2 bg-card px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400">{t("payTo")}</p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sm font-extrabold text-ink-900">
                    +250 794 626 004
                    <span className="ml-1 text-xs font-semibold text-ink-400">(MTN MoMo)</span>
                  </span>
                  <button
                    onClick={copyNumber}
                    className="tap-target flex shrink-0 items-center gap-1 rounded-xl2 border border-ink-100 px-2.5 py-1.5 text-xs font-bold text-ink-700 active:bg-ink-50"
                  >
                    {copied ? <Check size={14} className="text-brand-500" /> : <Copy size={14} />}
                    {copied ? t("copied") : t("copyNumber")}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!canSubmit}
              className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400"
            >
              {t("payDeposit")}
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <Loader2 size={36} className="animate-spin text-brand-500" />
            <p className="font-semibold text-ink-800">{t("processing")}</p>
          </div>
        )}

        {step === "ussd" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="tap-target rounded-full bg-gold-400/15 text-gold-600" style={{ height: 64, width: 64 }}>
              <Smartphone size={30} />
            </div>
            <p className="font-semibold text-ink-800">
              {t("ussdSent")} {phone || worker.momoNumber}
            </p>
            <p className="max-w-xs text-sm text-ink-400">{t("ussdInstruction")}</p>
          </div>
        )}

        {step === "confirmed" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <CheckCircle2 size={44} className="text-brand-500" />
            <p className="font-display text-lg font-bold text-ink-900">{t("bookingConfirmed")}</p>
            <p className="max-w-xs text-sm text-ink-400">
              {worker.name} {t("bookingConfirmedBody")}
            </p>
            <button
              onClick={onClose}
              className="tap-target mt-2 w-full rounded-xl2 bg-brand-500 px-6 text-sm font-bold text-white active:bg-brand-600"
            >
              {t("close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
