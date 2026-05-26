"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30"
      aria-label={isDark ? "Usar tema claro" : "Usar tema oscuro"}
      title={isDark ? "Usar tema claro" : "Usar tema oscuro"}
    >
      <Sun
        className={`h-[18px] w-[18px] transition-all duration-300 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
