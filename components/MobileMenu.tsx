"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

type Category = {
  categoria_producto_id: string;
  nombre: string;
};

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 top-0 z-[100] flex flex-col bg-neutral-950/98 text-white">
          {/* Close header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="font-display text-2xl font-bold">LAMA</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition"
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Menú móvil">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-semibold transition hover:bg-white/10"
              >
                Inicio
                <ChevronRight className="h-4 w-4 text-white/40" aria-hidden="true" />
              </Link>
              <Link
                href="/productos"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-semibold transition hover:bg-white/10"
              >
                Catálogo
                <ChevronRight className="h-4 w-4 text-white/40" aria-hidden="true" />
              </Link>
              <Link
                href="/compras"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-semibold transition hover:bg-white/10"
              >
                Mis Compras
                <ChevronRight className="h-4 w-4 text-white/40" aria-hidden="true" />
              </Link>
              <Link
                href="/carrito"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-semibold transition hover:bg-white/10"
              >
                Mi Carrito
                <ChevronRight className="h-4 w-4 text-white/40" aria-hidden="true" />
              </Link>
            </div>

            {/* Categories */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Categorías
              </p>
              <div className="space-y-0.5">
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

          {/* Footer CTA */}
          <div className="border-t border-white/10 px-5 py-5">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-lama-header py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
