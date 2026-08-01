"use client";

import Link from "next/link";
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
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Skill } from "@/lib/types";

const ICONS: Record<Skill, typeof Wrench> = {
  PLUMBER: Wrench,
  ELECTRICIAN: Zap,
  CLEANER: Sparkles,
  PAINTER: PaintRoller,
  MASON: HardHat,
  DRIVER: Car,
  IT_SUPPORT: Cpu,
  SOFTWARE_ENGINEER: Code,
  WEDDING_PLANNER: HeartHandshake,
  CHEF: ChefHat,
  HOME_WORKER: Home,
  FITNESS_TRAINER: Dumbbell,
  EVENT_SERVICES: PartyPopper,
};

const COLOR_CLASSES: Record<Skill, { text: string; bg: string; border: string }> = {
  PLUMBER: { text: "text-trade-plumber", bg: "bg-trade-plumber/10", border: "border-trade-plumber/20" },
  ELECTRICIAN: { text: "text-trade-electrician", bg: "bg-trade-electrician/10", border: "border-trade-electrician/20" },
  CLEANER: { text: "text-trade-cleaner", bg: "bg-trade-cleaner/10", border: "border-trade-cleaner/20" },
  PAINTER: { text: "text-trade-painter", bg: "bg-trade-painter/10", border: "border-trade-painter/20" },
  MASON: { text: "text-trade-mason", bg: "bg-trade-mason/10", border: "border-trade-mason/20" },
  DRIVER: { text: "text-trade-driver", bg: "bg-trade-driver/10", border: "border-trade-driver/20" },
  IT_SUPPORT: { text: "text-trade-it", bg: "bg-trade-it/10", border: "border-trade-it/20" },
  SOFTWARE_ENGINEER: { text: "text-trade-software", bg: "bg-trade-software/10", border: "border-trade-software/20" },
  WEDDING_PLANNER: { text: "text-trade-wedding", bg: "bg-trade-wedding/10", border: "border-trade-wedding/20" },
  CHEF: { text: "text-trade-chef", bg: "bg-trade-chef/10", border: "border-trade-chef/20" },
  HOME_WORKER: { text: "text-trade-home", bg: "bg-trade-home/10", border: "border-trade-home/20" },
  FITNESS_TRAINER: { text: "text-trade-fitness", bg: "bg-trade-fitness/10", border: "border-trade-fitness/20" },
  EVENT_SERVICES: { text: "text-trade-events", bg: "bg-trade-events/10", border: "border-trade-events/20" },
};

const ORDER: Skill[] = [
  "PLUMBER",
  "ELECTRICIAN",
  "CLEANER",
  "PAINTER",
  "MASON",
  "DRIVER",
  "IT_SUPPORT",
  "SOFTWARE_ENGINEER",
  "WEDDING_PLANNER",
  "CHEF",
  "HOME_WORKER",
  "FITNESS_TRAINER",
  "EVENT_SERVICES",
];

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-3">
      {ORDER.map((skill) => {
        const Icon = ICONS[skill];
        const c = COLOR_CLASSES[skill];
        return (
          <Link
            key={skill}
            href={`/search?skill=${skill}`}
            className={`flex flex-col items-center gap-2 rounded-xl2 border ${c.border} ${c.bg} px-2 py-4 text-center active:scale-95`}
          >
            <span className={`tap-target rounded-full bg-white ${c.text}`} style={{ height: 44, width: 44 }}>
              <Icon size={22} strokeWidth={2.25} />
            </span>
            <span className="text-xs font-bold leading-tight text-ink-800">
              {t(`skill_${skill}`)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
