"use client";

import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 rounded-md bg-lama-cream px-3 py-2 text-sm font-bold hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-ink"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Registrate / Inicia Sesión
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/sign-in" />
      </SignedIn>
    </div>
  );
}
