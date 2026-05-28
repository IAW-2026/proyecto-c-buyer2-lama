import Link from "next/link";
import {
  ChevronDown,
  Menu,
  Search,
  Shield,
  ShoppingBag
} from "lucide-react";
import { canAccessAdmin, getAuthContext, isClerkConfigured } from "@/lib/auth";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories } from "@/lib/mock-external";
import { MobileMenu } from "@/components/MobileMenu";

export async function Header() {
  const authContext = await getAuthContext();
  const showAdmin = canAccessAdmin(authContext);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Announcement bar ── */}
      <div className="bg-gradient-to-r from-lama-ink via-neutral-800 to-lama-ink px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-xs">
        Vende tu ropa acá&nbsp;&nbsp;|&nbsp;&nbsp;3 cuotas sin interés +60K&nbsp;&nbsp;|&nbsp;&nbsp;6 cuotas sin interés +120K
      </div>

      {/* ── Main nav ── */}
      <nav
        className="border-b border-white/10 bg-lama-ink/80 text-white backdrop-blur-xl transition-colors duration-300 dark:bg-black/70"
        aria-label="Navegacion principal"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-baseline gap-2 transition-opacity hover:opacity-80"
              aria-label="Ir al inicio de LAMA Buyer App"
            >
              <span className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                LAMA
              </span>
              <span className="rounded-full border border-white/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                Buyer
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 lg:flex">
              <Link
                href="/"
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Catálogo
              </Link>

              {/* Categories dropdown */}
              <details className="group relative">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none">
                  Categorías
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="absolute left-0 top-full z-50 mt-2 min-w-52 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 py-1.5 shadow-lg backdrop-blur-xl">
                  <Link
                    href="/productos"
                    className="block px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:outline-none"
                  >
                    Ver todos
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.categoria_producto_id}
                      href={`/productos?categoria=${category.categoria_producto_id}`}
                      className="block px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:outline-none"
                    >
                      {category.nombre}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop Search */}
            <form action="/productos" className="relative hidden lg:block">
              <label className="sr-only" htmlFor="header-search-desktop">
                Buscar producto
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                id="header-search-desktop"
                name="search"
                placeholder="Buscar prendas..."
                className="h-9 w-52 rounded-full border border-white/15 bg-white/10 pl-10 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/50 transition-all focus:w-64 focus:border-white/30 focus:bg-white/15 focus:ring-1 focus:ring-white/20"
              />
            </form>

            <Link
              href="/carrito"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30"
              aria-label="Mi carrito"
            >
              <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>

            <AccountMenu clerkConfigured={isClerkConfigured()} />

            {showAdmin ? (
              <Link
                href="/admin"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30"
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            ) : null}

            <ThemeToggle />

            {/* Mobile hamburger */}
            <MobileMenu categories={categories} />
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="border-t border-white/5 px-4 pb-3 pt-1 lg:hidden">
          <form action="/productos" className="relative">
            <label className="sr-only" htmlFor="header-search-mobile">
              Buscar producto
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <input
              id="header-search-mobile"
              name="search"
              placeholder="Buscar prendas..."
              className="h-10 w-full rounded-full border border-white/15 bg-white/10 pl-10 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/50 focus:border-white/25 focus:bg-white/15 focus:ring-1 focus:ring-white/20"
            />
          </form>
        </div>
      </nav>
    </header>
  );
}
