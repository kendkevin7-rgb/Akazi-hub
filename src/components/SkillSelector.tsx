"use client";

import {
  Wrench,
  Zap,
  Sparkles,
  PaintRoller,
  HardHat,
  Car,
  Cpu,
  Code,
  HeartHandshake,
  ChefHat,
  Home,
  Dumbbell,
  PartyPopper,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Skill } from "@/lib/types";
import clsx from "clsx";

const OPTIONS: { key: Skill; icon: typeof Wrench; color: string; bg: string; border: string }[] = [
  { key: "PLUMBER", icon: Wrench, color: "text-trade-plumber", bg: "bg-trade-plumber/10", border: "border-trade-plumber" },
  { key: "ELECTRICIAN", icon: Zap, color: "text-trade-electrician", bg: "bg-trade-electrician/10", border: "border-trade-electrician" },
  { key: "CLEANER", icon: Sparkles, color: "text-trade-cleaner", bg: "bg-trade-cleaner/10", border: "border-trade-cleaner" },
  { key: "PAINTER", icon: PaintRoller, color: "text-trade-painter", bg: "bg-trade-painter/10", border: "border-trade-painter" },
  { key: "MASON", icon: HardHat, color: "text-trade-mason", bg: "bg-trade-mason/10", border: "border-trade-mason" },
  { key: "DRIVER", icon: Car, color: "text-trade-driver", bg: "bg-trade-driver/10", border: "border-trade-driver" },
  { key: "IT_SUPPORT", icon: Cpu, color: "text-trade-it", bg: "bg-trade-it/10", border: "border-trade-it" },
  { key: "SOFTWARE_ENGINEER", icon: Code, color: "text-trade-software", bg: "bg-trade-software/10", border: "border-trade-software" },
  { key: "WEDDING_PLANNER", icon: HeartHandshake, color: "text-trade-wedding", bg: "bg-trade-wedding/10", border: "border-trade-wedding" },
  { key: "CHEF", icon: ChefHat, color: "text-trade-chef", bg: "bg-trade-chef/10", border: "border-trade-chef" },
  { key: "HOME_WORKER", icon: Home, color: "text-trade-home", bg: "bg-trade-home/10", border: "border-trade-home" },
  { key: "FITNESS_TRAINER", icon: Dumbbell, color: "text-trade-fitness", bg: "bg-trade-fitness/10", border: "border-trade-fitness" },
  { key: "EVENT_SERVICES", icon: PartyPopper, color: "text-trade-events", bg: "bg-trade-events/10", border: "border-trade-events" },
];

export default function SkillSelector({
  selected,
  onSelect,
}: {
  selected: Skill | null;
  onSelect: (skill: Skill) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map(({ key, icon: Icon, color, bg, border }) => {
        const active = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={clsx(
              "relative flex items-center gap-3 rounded-xl2 border-2 px-3 py-3 text-left",
              active ? border : "border-ink-100",
              active ? bg : "bg-card"
            )}
          >
            <span className={clsx("tap-target rounded-full bg-card", color)} style={{ height: 40, width: 40 }}>
              <Icon size={20} strokeWidth={2.25} />
            </span>
            <span className="text-sm font-bold text-ink-900">{t(`skill_${key}`)}</span>
            {active && (
              <span className="absolute right-2 top-2 text-brand-500">
                <Check size={16} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
