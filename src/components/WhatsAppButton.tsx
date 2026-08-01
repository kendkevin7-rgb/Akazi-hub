"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const SUPPORT_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || "250794626004";

export default function WhatsAppButton() {
  const { t } = useLanguage();

  return (
    <a
      href={`https://wa.me/${SUPPORT_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappSupport")}
      className="tap-target fixed bottom-24 right-4 z-30 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-floating active:scale-95"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}
