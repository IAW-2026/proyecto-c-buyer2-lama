import Link from "next/link";
import {
  ChevronDown,
  Menu,
  Search,
  Shield
} from "lucide-react";
import { canAccessAdmin, getAuthContext, isClerkConfigured } from "@/lib/auth";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories } from "@/lib/mock-external";

const heroBackground = {
  backgroundImage:
    "linear-gradient(90deg, rgba(0,0,0,0.48), rgba(0,0,0,0.2), rgba(0,0,0,0.55)), url('/products/campera_denim.webp')"
};

export async function Header() {
  const authContext = await getAuthContext();
  const showAdmin = canAccessAdmin(authContext);

  return (
    <header className="sticky top-0 z-30 text-white shadow-sm">
      <div className="bg-black px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide sm:text-xl">
        Vende tu ropa aca | 3 cuotas sin interes +60K y 6 cuotas sin interes +120K
      </div>
      <div className="bg-cover bg-center" style={heroBackground}>
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-3 px-4 py-4 lg:grid-cols-[1fr_auto_1fr]">
          <details className="group relative z-50 justify-self-start">
            <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-md px-2 text-sm font-bold uppercase hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80">
              <Menu className="h-6 w-6" aria-hidden="true" />
              <span className="hidden sm:inline">Categorias</span>
              <ChevronDown className="hidden h-4 w-4 sm:block" aria-hidden="true" />
            </summary>
            <div className="absolute left-0 top-full z-50 mt-3 min-w-56 overflow-hidden rounded-md border border-white/15 bg-black/90 py-2 text-white shadow-soft backdrop-blur">
              <Link
                href="/"
                className="block px-4 py-2 text-sm font-semibold hover:bg-white/15 focus:bg-white/15 focus:outline-none"
              >
                Ver todos
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.categoria_producto_id}
                  href={`/?categoria=${category.categoria_producto_id}`}
                  className="block px-4 py-2 text-sm font-semibold hover:bg-white/15 focus:bg-white/15 focus:outline-none"
                >
                  {category.nombre}
                </Link>
              ))}
            </div>
          </details>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-center text-4xl font-bold leading-tight drop-shadow sm:text-5xl"
            aria-label="Ir al inicio de lama Buyer App"
          >
            Lama
          </Link>

          <nav
            className="flex items-center justify-end gap-2 justify-self-end lg:col-span-1 lg:justify-self-end"
            aria-label="Navegacion principal"
          >
            <form action="/" className="relative hidden h-10 w-56 lg:block">
              <label className="sr-only" htmlFor="header-search-desktop">
                Buscar producto
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                id="header-search-desktop"
                name="search"
                placeholder="Buscar"
                className="h-10 w-full rounded-md border border-white/30 bg-black/25 pl-10 pr-3 text-sm font-semibold text-white outline-none placeholder:text-white/85 focus:ring-2 focus:ring-white/80"
              />
            </form>

            <AccountMenu clerkConfigured={isClerkConfigured()} />
            {showAdmin ? (
              <Link
                href="/admin"
                className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                Admin
              </Link>
            ) : null}
            <ThemeToggle />
          </nav>

          <form action="/" className="relative col-span-3 mx-auto h-10 w-44 sm:w-56 lg:hidden">
            <label className="sr-only" htmlFor="header-search-mobile">
              Buscar producto
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              id="header-search-mobile"
              name="search"
              placeholder="Buscar"
              className="h-10 w-full rounded-md border border-white/30 bg-black/25 pl-10 pr-3 text-sm font-semibold text-white outline-none placeholder:text-white/85 focus:ring-2 focus:ring-white/80"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
