"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface PickedFile {
  name: string;
  sizeKb: number;
}

export default function DocumentUpload({
  label,
  hint,
  onChange,
}: {
  label: string;
  hint: string;
  onChange: (ready: boolean) => void;
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<PickedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  function handlePick(f: File | undefined) {
    if (!f) return;
    setFile({ name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) });
    setDone(false);
    setUploading(true);
    onChange(false);
    setTimeout(() => {
      setUploading(false);
      setDone(true);
      onChange(true);
    }, 1200);
  }

  function clear() {
    setFile(null);
    setDone(false);
    setUploading(false);
    onChange(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-ink-800">{label}</label>
      <div className="rounded-xl2 border border-ink-100 bg-surface p-3">
        {file ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  done ? "bg-brand-50 text-brand-500" : "bg-brand-50 text-brand-400"
                }`}
              >
                {done ? <CheckCircle2 size={18} /> : <Loader2 size={18} className="animate-spin" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{file.name}</p>
                <p className="text-xs text-ink-400">
                  {file.sizeKb} KB · {done ? t("uploadSuccess") : t("uploading")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clear}
              aria-label={t("removeFile")}
              className="tap-target rounded-full text-ink-400 hover:bg-ink-50 hover:text-danger"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-1.5 py-3 text-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <UploadCloud size={20} />
            </span>
            <span className="text-sm font-bold text-brand-600">{t("uploadFile")}</span>
            <span className="text-xs text-ink-400">{hint}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0])}
      />
    </div>
  );
}
