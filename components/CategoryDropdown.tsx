"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type Category = {
  categoria_producto_id: string;
  nombre: string;
};

const genderLinks = [
  { label: "Hombre", value: "hombre" },
  { label: "Mujer", value: "mujer" },
  { label: "Niños", value: "niños" }
];

function buildGenderHref(value: string) {
  return `/productos?${new URLSearchParams({ genero: value }).toString()}`;
}

export function CategoryDropdown({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Categorias
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          className="absolute left-0 top-full z-50 mt-2 min-w-52 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 py-1.5 shadow-lg backdrop-blur-xl"
          role="menu"
        >
          <Link
            href="/productos"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:outline-none"
            role="menuitem"
          >
            Ver todos
          </Link>
          {genderLinks.map((gender) => (
            <Link
              key={gender.value}
              href={buildGenderHref(gender.value)}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:outline-none"
              role="menuitem"
            >
              {gender.label}
            </Link>
          ))}
          <div className="my-1 border-t border-white/10" role="separator" />
          {categories.map((category) => (
            <Link
              key={category.categoria_producto_id}
              href={`/productos?categoria=${category.categoria_producto_id}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:outline-none"
              role="menuitem"
            >
              {category.nombre}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
