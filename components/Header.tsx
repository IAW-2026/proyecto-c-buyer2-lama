import Link from "next/link";
import { Search } from "lucide-react";
import { canAccessAdmin, getAuthContext, isClerkConfigured } from "@/lib/auth";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { HeaderScrollSurface } from "@/components/HeaderScrollSurface";
import { MobileMenu } from "@/components/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCategories } from "@/lib/seller-service";

export async function Header() {
  const authContext = await getAuthContext();
  const showAdmin = canAccessAdmin(authContext);
  const categories = showAdmin ? [] : await getCategories().catch(() => []);

  return (
    <header className="sticky top-0 z-50">
      {!showAdmin ? (
        <div className="bg-gradient-to-r from-lama-ink via-neutral-800 to-lama-ink px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-xs">
          Moda Circular&nbsp;&nbsp;|&nbsp;&nbsp;Prendas únicas&nbsp;&nbsp;|&nbsp;&nbsp;Fácil y seguro
        </div>
      ) : null}

      <HeaderScrollSurface>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-8">
            <Link
              href={showAdmin ? "/admin" : "/"}
              className="flex items-baseline transition-opacity hover:opacity-80"
              aria-label="Ir al inicio de LAMA"
            >
              <span className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                LAMA
              </span>
            </Link>

            {!showAdmin ? (
              <div className="hidden items-center gap-1 lg:flex">
                <Link
                  href="/"
                  className="relative rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Inicio
                </Link>
                <CategoryDropdown categories={categories} />
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!showAdmin ? (
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
            ) : null}

            <AccountMenu clerkConfigured={isClerkConfigured()} isAdmin={showAdmin} />

            <ThemeToggle />
            {!showAdmin ? <MobileMenu categories={categories} /> : null}
          </div>
        </div>

        {!showAdmin ? (
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
        ) : null}
      </HeaderScrollSurface>
    </header>
  );
}
