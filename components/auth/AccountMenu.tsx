"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { LogIn, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";

function AccountMenuContent({ showSignedInLinks }: { showSignedInLinks: boolean }) {
  return showSignedInLinks ? (
    <>
      <Link
        href="/perfil"
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-white/15 focus:bg-white/15 focus:outline-none"
      >
        <UserRound className="h-4 w-4" aria-hidden="true" />
        Perfil
      </Link>
      <Link
        href="/compras"
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-white/15 focus:bg-white/15 focus:outline-none"
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        Mis compras
      </Link>
      <Link
        href="/carrito"
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-white/15 focus:bg-white/15 focus:outline-none"
      >
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        Mi Carrito
      </Link>
    </>
  ) : (
    <Link
      href="/sign-in"
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 focus:bg-white/15 focus:outline-none"
    >
      <LogIn className="h-4 w-4" aria-hidden="true" />
      Registrate / Inicia Sesion
    </Link>
  );
}

export function AccountMenu({ clerkConfigured }: { clerkConfigured: boolean }) {
  return (
    <details className="group relative z-40">
      <summary
        className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80"
        aria-label="Abrir menu de cuenta"
      >
        <UserRound className="h-5 w-5" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-3 min-w-56 overflow-hidden rounded-md border border-white/15 bg-black/90 py-2 text-white shadow-soft backdrop-blur">
        {clerkConfigured ? (
          <>
            <SignedIn>
              <AccountMenuContent showSignedInLinks />
            </SignedIn>
            <SignedOut>
              <AccountMenuContent showSignedInLinks={false} />
            </SignedOut>
          </>
        ) : (
          <AccountMenuContent showSignedInLinks={false} />
        )}
      </div>
    </details>
  );
}
