"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function HeaderScrollSurface({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === "/";
  const isSolid = !isHome || isScrolled;

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
      className={`border-b text-white transition-all duration-300 ${
        isSolid
          ? "border-white/10 bg-lama-ink/80 backdrop-blur-xl dark:bg-black/70"
          : "border-transparent bg-transparent"
      }`}
      aria-label="Navegacion principal"
    >
      {children}
    </nav>
  );
}
