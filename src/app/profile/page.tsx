"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, HelpCircle, Info, LogOut, UserCog, Hammer, ScrollText, FileText, Shield, Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n";
import { getUser, clearUser } from "@/lib/session";
import clsx from "clsx";

export default function ProfilePage() {
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    clearUser();
    setLoggedOut(true);
    setTimeout(() => router.push("/"), 900);
  };

  const rows = [
    { icon: UserCog, label: t("editProfile"), href: "/profile/edit" },
    { icon: HelpCircle, label: t("helpCenter"), href: "/help" },
    { icon: Info, label: t("aboutApp"), href: "/about" },
  ];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-3 rounded-xl2 border border-ink-100 bg-white p-4">
        <div className="tap-target rounded-full bg-brand-500 text-white" style={{ height: 56, width: 56 }}>
          <span className="font-display text-lg font-extrabold">{initials}</span>
        </div>
        <div>
          <p className="font-display font-bold text-ink-900">{user.name}</p>
          <p className="text-sm text-ink-400">
            {user.phone} · {user.city}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
          {t("languageSetting")}
        </h2>
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white">
          {LANGUAGES.map((l, i) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={clsx(
                "tap-target flex w-full items-center justify-between px-4 text-sm font-semibold",
                i !== LANGUAGES.length - 1 && "border-b border-ink-50",
                lang === l.code ? "text-brand-600" : "text-ink-800"
              )}
            >
              {l.native}
              {lang === l.code && <span className="h-2 w-2 rounded-full bg-brand-500" />}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white">
          {rows.map((row, i) => (
            <Link
              key={row.label}
              href={row.href}
              className={clsx(
                "tap-target flex w-full items-center justify-between px-4 text-sm font-semibold text-ink-800",
                i !== rows.length - 1 && "border-b border-ink-50"
              )}
            >
              <span className="flex items-center gap-2.5">
                <row.icon size={18} className="text-ink-400" />
                {row.label}
              </span>
              <ChevronRight size={16} className="text-ink-400" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">{t("legal")}</h2>
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white">
          {[
            { icon: ScrollText, label: t("termsTitle"), href: "/legal/terms" },
            { icon: FileText, label: t("privacyTitle"), href: "/legal/privacy" },
            { icon: Shield, label: t("securityTitle"), href: "/legal/security" },
          ].map((row, i, arr) => (
            <Link
              key={row.href}
              href={row.href}
              className={clsx(
                "tap-target flex w-full items-center justify-between px-4 text-sm font-semibold text-ink-800",
                i !== arr.length - 1 && "border-b border-ink-50"
              )}
            >
              <span className="flex items-center gap-2.5">
                <row.icon size={18} className="text-ink-400" />
                {row.label}
              </span>
              <ChevronRight size={16} className="text-ink-400" />
            </Link>
          ))}
        </div>
      </section>

      <Link
        href="/onboarding"
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl2 border-2 border-dashed border-brand-300 bg-brand-50 text-sm font-bold text-brand-600"
      >
        <Hammer size={16} />
        {t("becomeWorker")}
      </Link>

      {loggedOut && (
        <p className="flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-brand-600">
          <Check size={16} />
          {t("logOutConfirm")}
        </p>
      )}

      <button
        onClick={handleLogout}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl2 border border-danger/30 text-sm font-bold text-danger"
      >
        <LogOut size={16} />
        {t("logOut")}
      </button>
    </div>
  );
}
