"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { DEFAULT_USER, getUser, setUser } from "@/lib/session";

export default function EditProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const initial = getUser();
  const [form, setForm] = useState({
    name: initial.name,
    phone: initial.phone,
    city: initial.city,
    neighborhood: initial.neighborhood,
  });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...form, name: form.name || DEFAULT_USER.name });
    setSaved(true);
    setTimeout(() => router.push("/profile"), 900);
  };

  const fields = [
    { key: "name" as const, label: t("nameLabel"), type: "text" },
    { key: "phone" as const, label: t("phoneLabel"), type: "tel" },
    { key: "city" as const, label: t("cityLabel"), type: "text" },
    { key: "neighborhood" as const, label: t("neighborhoodLabel"), type: "text" },
  ];

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-2">
        <Link href="/profile" aria-label={t("backToProfile")} className="tap-target rounded-full text-ink-600 active:bg-ink-50">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="font-display text-lg font-extrabold text-ink-900">{t("editProfile")}</h1>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white">
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
                className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none placeholder:text-ink-300"
                placeholder={f.label}
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="tap-target flex w-full items-center justify-center gap-2 rounded-xl2 bg-brand-500 text-sm font-bold text-white active:scale-[0.99]"
        >
          {saved ? <Check size={16} /> : null}
          {saved ? t("saved") : t("save")}
        </button>
      </form>
    </div>
  );
}
