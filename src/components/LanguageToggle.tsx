"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="tap-target gap-1.5 rounded-full border border-ink-100 bg-white px-3 text-sm font-semibold text-ink-800 active:bg-ink-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={16} className="text-brand-500" />
        {current.code.toUpperCase()}
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-12 z-40 w-48 overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-floating"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-ink-800 hover:bg-brand-50 active:bg-brand-100"
            >
              <span>
                {l.native}
                <span className="ml-1.5 text-ink-400">({l.label})</span>
              </span>
              {l.code === lang && <Check size={16} className="text-brand-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
