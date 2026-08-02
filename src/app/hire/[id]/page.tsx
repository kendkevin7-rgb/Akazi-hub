"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle2,
  Smartphone,
  Loader2,
  Phone,
  MessageCircle,
  Mail,
  Copy,
  Check,
  CalendarCheck,
} from "lucide-react";
import { WORKERS, skillMeta } from "@/lib/mockData";
import { useWorkers } from "@/lib/useWorkers";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { apiWithCsrf } from "@/lib/auth-client";
import WorkerAvatar from "@/components/WorkerAvatar";
import { telLink, whatsappLink } from "@/lib/contact";
import { PLATFORM_PHONE, COMMISSION_RATE, platformFee, workerReceives } from "@/lib/payments";

const DEPOSIT_RWF = 2000;

type Step = "details" | "processing" | "done";

export default function HirePage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const { workers, loading } = useWorkers();
  const { user, loading: authLoading } = useAuth();

  const source = workers.length > 0 ? workers : WORKERS;
  const worker = source.find((w) => w.id === params.id);

  const [step, setStep] = useState<Step>("details");
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState<{ phone: string; email?: string | null } | null>(null);

  if (!worker) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-24 text-ink-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      );
    }
    notFound();
  }
  const w = worker;

  const meta = skillMeta(worker.skill);
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

  async function handlePay() {
    if (!user) return;
    setError(null);
    try {
      const res = await apiWithCsrf("/api/bookings", {
        body: { workerId: w.id, task, date, time, phone },
      });
      if (!res.ok) {
        setError("GENERIC");
        return;
      }
      const data = await res.json().catch(() => null);
      setContact(data?.contact ?? null);
      setStep("processing");
      setTimeout(() => setStep("done"), 1600);
    } catch {
      setError("GENERIC");
    }
  }

  return (
    <div className="space-y-4 pb-6">
      <Link
        href={`/worker/${worker.id}`}
        className="tap-target inline-flex gap-1 text-sm font-bold text-ink-600"
      >
        <ChevronLeft size={18} /> {t("back")}
      </Link>

      <div className="flex items-center gap-3 rounded-xl2 border border-ink-100 bg-card p-4">
        <WorkerAvatar photoUrl={worker.photoUrl} name={worker.name} size={56} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-bold text-ink-900">{worker.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.bg} ${meta.color}`}>
              {t(meta.labelKey)}
            </span>
            <span className="text-xs font-semibold text-ink-400">{worker.neighborhood}</span>
          </div>
        </div>
        <p className="shrink-0 font-display text-sm font-extrabold text-brand-600">
          {worker.rateRwf.toLocaleString()} RWF
          <span className="text-xs font-semibold text-ink-400">
            {worker.rateUnit === "hour" ? t("perHour") : t("perDay")}
          </span>
        </p>
      </div>

      {authLoading && (
        <div className="flex items-center justify-center py-16 text-ink-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      )}

      {!authLoading && !user && (
        <div className="space-y-3 rounded-xl2 border border-ink-100 bg-card p-5 text-center">
          <h2 className="font-display text-lg font-bold text-ink-900">{t("profileTitle")}</h2>
          <p className="text-sm text-ink-400">{t("loginSubtitle")}</p>
          <Link
            href={`/login?next=/hire/${worker.id}`}
            className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600"
          >
            {t("signIn")}
          </Link>
        </div>
      )}

      {!authLoading && user && step === "details" && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-800">{t("describeTask")}</label>
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
              <label className="mb-1 block text-sm font-semibold text-ink-800">{t("chooseDate")}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-800">{t("chooseTime")}</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="tap-target w-full rounded-xl2 border border-ink-100 bg-surface px-3 text-sm text-ink-900 outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-800">{t("yourPhone")}</label>
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
                <span>
                  {t("platformFee")} ({(COMMISSION_RATE * 100).toFixed(0)}%)
                </span>
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

          {error && (
            <p className="rounded-xl2 border border-danger/20 bg-danger/10 px-3 py-2.5 text-center text-sm font-semibold text-danger">
              {t("errGeneric")}
            </p>
          )}

          <button
            onClick={handlePay}
            disabled={!canSubmit}
            className="tap-target w-full rounded-xl2 bg-brand-500 text-sm font-bold text-white active:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400"
          >
            {t("payDeposit")}
          </button>
        </div>
      )}

      {user && step === "processing" && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Loader2 size={36} className="animate-spin text-brand-500" />
          <p className="font-semibold text-ink-800">{t("processing")}</p>
          <p className="max-w-xs text-sm text-ink-400">{t("ussdInstruction")}</p>
        </div>
      )}

      {user && step === "done" && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 size={48} className="text-brand-500" />
            <p className="font-display text-lg font-bold text-ink-900">{t("bookingConfirmed")}</p>
            <p className="max-w-xs text-sm text-ink-400">
              {worker.name} {t("bookingConfirmedBody")}
            </p>
          </div>

          <div className="rounded-xl2 border border-ink-100 bg-card p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-400">{t("contactAfterPay")}</p>

            <div className="mb-3 flex items-center gap-3">
              <WorkerAvatar photoUrl={worker.photoUrl} name={worker.name} size={48} />
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-ink-900">{worker.name}</p>
                {contact?.phone && (
                  <p className="text-xs font-semibold text-ink-500">{contact.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <CalendarCheck size={16} className="text-brand-500" />
                {date} · {time}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                <Smartphone size={16} className="text-brand-500" />
                {t("yourPhone")}: {phone}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={telLink(contact?.phone ?? worker.momoNumber)}
                className="tap-target flex items-center justify-center gap-1.5 rounded-xl2 bg-brand-500 px-3 py-2.5 text-sm font-bold text-white active:bg-brand-600"
              >
                <Phone size={16} /> {t("call")}
              </a>
              <a
                href={whatsappLink(contact?.phone ?? worker.momoNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target flex items-center justify-center gap-1.5 rounded-xl2 bg-[#25D366] px-3 py-2.5 text-sm font-bold text-white active:opacity-90"
              >
                <MessageCircle size={16} /> {t("whatsapp")}
              </a>
            </div>
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="tap-target mt-2 flex items-center justify-center gap-1.5 rounded-xl2 border border-ink-100 px-3 py-2.5 text-sm font-bold text-ink-700 active:bg-ink-50"
              >
                <Mail size={16} /> {t("email")}: {contact.email}
              </a>
            )}
          </div>

          <Link
            href={`/worker/${worker.id}`}
            className="tap-target w-full rounded-xl2 bg-brand-500 px-6 text-sm font-bold text-white active:bg-brand-600"
          >
            {t("close")}
          </Link>
        </div>
      )}
    </div>
  );
}
