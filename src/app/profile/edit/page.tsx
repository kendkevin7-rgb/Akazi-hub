"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { apiWithCsrf } from "@/lib/auth-client";

export default function EditProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(() => ({
    name: user?.fullName ?? "",
    phone: user?.phoneNumber ?? "",
    city: user?.city ?? "",
    neighborhood: user?.neighborhood ?? "",
  }));

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await apiWithCsrf("/api/profile", {
        method: "PATCH",
        body: {
          fullName: form.name,
          city: form.city,
          neighborhood: form.neighborhood,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "INVALID_NAME" ? t("errGeneric") : data.error ?? t("errGeneric"));
        return;
      }
      await refresh();
      setSaved(true);
      setTimeout(() => router.push("/profile"), 900);
    } catch {
      setError(t("errGeneric"));
    } finally {
      setBusy(false);
    }
  };

  const fields = [
    { key: "name" as const, label: t("nameLabel"), type: "text", readOnly: false },
    { key: "phone" as const, label: t("phoneLabel"), type: "tel", readOnly: true },
    { key: "city" as const, label: t("cityLabel"), type: "text", readOnly: false },
    { key: "neighborhood" as const, label: t("neighborhoodLabel"), type: "text", readOnly: false },
  ];

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <Loader2 size={28} className="animate-spin text-brand-500" />
        <Link href="/profile" className="text-sm font-bold text-brand-600">
          {t("backToProfile")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-2">
        <Link href="/profile" aria-label={t("backToProfile")} className="tap-target rounded-full text-ink-600 active:bg-ink-50">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="font-display text-lg font-extrabold text-ink-900">{t("editProfile")}</h1>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-card">
          {fields.map((f, i) => (
            <label
              key={f.key}
              className={`block px-4 py-3 ${i !== fields.length - 1 ? "border-b border-ink-50" : ""}`}
            >
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">
                {f.label}
              </span>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={update(f.key)}
                readOnly={f.readOnly}
                disabled={f.readOnly}
                className={`w-full bg-transparent text-sm font-semibold text-ink-900 outline-none placeholder:text-ink-300 ${
                  f.readOnly ? "text-ink-400" : ""
                }`}
                placeholder={f.label}
              />
            </label>
          ))}
        </div>

        {error && (
          <p role="alert" className="rounded-xl2 border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm font-semibold text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="tap-target flex w-full items-center justify-center gap-2 rounded-xl2 bg-brand-500 text-sm font-bold text-white active:scale-[0.99] disabled:bg-ink-100 disabled:text-ink-400"
        >
          {saved ? <Check size={16} /> : busy ? <Loader2 size={16} className="animate-spin" /> : null}
          {saved ? t("saved") : busy ? t("processing") : t("save")}
        </button>
      </form>
    </div>
  );
}
