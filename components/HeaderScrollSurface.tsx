"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HeaderScrollSurface({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function updateHeaderState() {
      setIsScrolled(window.scrollY > 32);
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  return (
    <nav
      className={`border-b text-white backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? "border-white/10 bg-lama-ink/80 dark:bg-black/70"
          : "border-transparent bg-transparent"
      }`}
      aria-label="Navegacion principal"
    >
      {children}
    </nav>
  );
}
