"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Heart, LogIn, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";

function SignedOutAccountMenu() {
  return (
    <details className="group relative z-40">
      <summary
        className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80"
        aria-label="Abrir menu de cuenta"
      >
        <UserRound className="h-5 w-5" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-3 min-w-56 overflow-hidden rounded-md border border-white/15 bg-black/90 py-2 text-white shadow-soft backdrop-blur">
        <Link
          href="/sign-in"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 focus:bg-white/15 focus:outline-none"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Registrate / Inicia Sesion
        </Link>
      </div>
    </details>
  );
}

function ClerkAccountMenu({ isAdmin }: { isAdmin: boolean }) {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: "h-9 w-9",
          userButtonTrigger:
            "h-10 w-10 rounded-md hover:bg-white/15 focus:shadow-none focus:ring-2 focus:ring-white/80"
        }
      }}
    >
      {!isAdmin ? (
        <UserButton.MenuItems>
          <UserButton.Link
            href="/perfil"
            label="Perfil"
            labelIcon={<UserRound className="h-4 w-4" aria-hidden="true" />}
          />
          <UserButton.Link
            href="/compras"
            label="Mis compras"
            labelIcon={<ShoppingBag className="h-4 w-4" aria-hidden="true" />}
          />
          <UserButton.Link
            href="/favoritos"
            label="Mis favoritos"
            labelIcon={<Heart className="h-4 w-4" aria-hidden="true" />}
          />
          <UserButton.Link
            href="/carrito"
            label="Mi Carrito"
            labelIcon={<ShoppingCart className="h-4 w-4" aria-hidden="true" />}
          />
        </UserButton.MenuItems>
      ) : null}
    </UserButton>
  );
}

function StaticAccountMenu() {
  return (
    <Link
      href="/sign-in"
      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80"
      aria-label="Registrate o inicia sesion"
    >
      <UserRound className="h-5 w-5" aria-hidden="true" />
    </Link>
  );
}

export function AccountMenu({
  clerkConfigured,
  isAdmin = false
}: {
  clerkConfigured: boolean;
  isAdmin?: boolean;
}) {
  if (!clerkConfigured) {
    return <StaticAccountMenu />;
  }

  return (
    <>
      <SignedIn>
        <ClerkAccountMenu isAdmin={isAdmin} />
      </SignedIn>
      <SignedOut>
        <SignedOutAccountMenu />
      </SignedOut>
    </>
  );
}
