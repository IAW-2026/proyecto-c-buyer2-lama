"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";

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

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const menu =
    mounted && open
      ? createPortal(
        <div
          className="fixed inset-0 z-[200] flex h-dvh flex-col overflow-hidden bg-neutral-950 text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Menu movil"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="font-display text-2xl font-bold">LAMA</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10"
              aria-label="Cerrar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Menu movil">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-semibold transition hover:bg-white/10"
              >
                Inicio
                <ChevronRight className="h-4 w-4 text-white/40" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Categorías
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/productos"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  Ver todos
                  <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
                </Link>
                {genderLinks.map((gender) => (
                  <Link
                    key={gender.value}
                    href={buildGenderHref(gender.value)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    {gender.label}
                    <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
                  </Link>
                ))}
                <div className="my-2 border-t border-white/10" />
                {categories.map((category) => (
                  <Link
                    key={category.categoria_producto_id}
                    href={`/productos?categoria=${category.categoria_producto_id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    {category.nombre}
                    <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="border-t border-white/10 px-5 py-5">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-lama-header py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
            >
              Iniciar sesión / Registrarse
            </Link>
          </div>
        </div>,
        document.body
      )
      : null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30"
        aria-label={open ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {menu}
    </div>
  );
}
