"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="tap-target gap-1.5 rounded-full border border-ink-100 bg-card px-3 text-sm font-semibold text-ink-800 active:bg-ink-50"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} className="text-gold-400" /> : <Moon size={16} className="text-brand-500" />}
    </button>
  );
}
