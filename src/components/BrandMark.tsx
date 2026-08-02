"use client";

import { Wrench, BadgeCheck } from "lucide-react";

export default function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-xl2 bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-floating"
      style={{ height: size, width: size }}
      aria-hidden="true"
    >
      <Wrench size={Math.round(size * 0.5)} strokeWidth={2.5} />
      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-ink-900 shadow-sm">
        <BadgeCheck size={12} strokeWidth={3} />
      </span>
    </span>
  );
}
