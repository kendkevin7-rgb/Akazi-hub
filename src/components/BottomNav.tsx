"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ClipboardList, UserRound } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: "/", label: t("navHome"), icon: Home },
    { href: "/search", label: t("navSearch"), icon: Search },
    { href: "/jobs", label: t("navJobs"), icon: ClipboardList },
    { href: "/profile", label: t("navProfile"), icon: UserRound },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-card/98 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="container-mobile grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="tap-target flex-col gap-0.5 py-2"
              aria-current={active ? "page" : undefined}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={clsx(active ? "text-brand-500" : "text-ink-400")}
              />
              <span
                className={clsx(
                  "text-[11px] font-semibold",
                  active ? "text-brand-500" : "text-ink-400"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
