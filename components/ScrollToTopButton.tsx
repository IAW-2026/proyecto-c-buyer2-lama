"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > 360);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-24 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-lama-ink/80 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-lama-ink hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 dark:border-white/70 dark:bg-white/90 dark:text-neutral-900 dark:hover:bg-white ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-label="Volver al comienzo de la página"
      title="Volver arriba"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
