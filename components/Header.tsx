import Link from "next/link";
import { Shield } from "lucide-react";
import { canAccessAdmin, getAuthContext, isClerkConfigured } from "@/lib/auth";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { AuthNavLinks } from "@/components/auth/AuthNavLinks";

export async function Header() {
  const authContext = await getAuthContext();
  const showAdmin = canAccessAdmin(authContext);

  return (
    <header className="sticky top-0 z-30 border-b border-lama-detail/30 bg-lama-header text-lama-ink shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
  href="/"
  className="flex items-center justify-center gap-2 text-center"
  aria-label="Ir al inicio de lama Buyer App"
>
  <span>
    <span className="block text-5xl font-bold leading-tight">
      Lama
    </span>
  </span>
</Link>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Navegacion principal">
          <AuthNavLinks />
          {showAdmin ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-lama-cream/65 focus:outline-none focus:ring-2 focus:ring-lama-ink"
            >
              <Shield className="h-4 w-4" aria-hidden="true" />
              Admin
            </Link>
          ) : null}
          {isClerkConfigured() ? <AuthButtons /> : null}
        </nav>
      </div>
    </header>
  );
}
