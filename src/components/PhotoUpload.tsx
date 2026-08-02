"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Resize + re-encode so the upload payload stays well under hosting limits. */
async function compressImage(file: File, maxDim = 640, quality = 0.8): Promise<string> {
  const src = await readFileAsDataUrl(file);
  try {
    const img = await loadImage(src);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return src;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const out = canvas.toDataURL("image/jpeg", quality);
    return out.length < src.length ? out : src;
  } catch {
    return src;
  }
}

export default function PhotoUpload({
  onChange,
}: {
  onChange: (ready: boolean, fileName?: string, dataUrl?: string) => void;
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tooBig, setTooBig] = useState(false);

  const MAX_BYTES = 10 * 1024 * 1024;

  async function handlePick(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setTooBig(true);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setTooBig(false);
    setUploading(true);
    onChange(false);
    const dataUrl = await compressImage(f).catch(() => undefined);
    setPreview(dataUrl ?? null);
    setTimeout(() => {
      setUploading(false);
      onChange(true, f.name, dataUrl);
    }, 600);
  }

  function clear() {
    setPreview(null);
    setUploading(false);
    onChange(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="mb-1 block w-full text-center text-sm font-semibold text-ink-800">
        {t("photoLabel")}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-ink-100 bg-surface"
        aria-label={t("photoLabel")}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={t("photoPreview")} className="h-full w-full object-cover" />
        ) : uploading ? (
          <Loader2 size={24} className="animate-spin text-brand-500" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-ink-400">
            <Camera size={26} className="text-brand-500" />
            <span className="text-[11px] font-semibold">{t("addPhoto")}</span>
          </span>
        )}
        {preview && !uploading && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            onKeyDown={(e) => e.key === "Enter" && clear()}
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-danger text-white shadow-sm"
            aria-label={t("removePhoto")}
          >
            <X size={14} strokeWidth={3} />
          </span>
        )}
      </button>
      <p className="text-xs text-ink-400">{t("photoHint")}</p>
      {tooBig && <p className="text-xs font-semibold text-danger">{t("photoTooBig")}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0])}
      />
    </div>
  );
}
