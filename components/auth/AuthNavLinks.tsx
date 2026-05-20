"use client";
/*
el Header estaba decidiendo esos links desde el servidor con auth(). 
En ese instante posterior al registro, Clerk del cliente ya estaba logueado, por eso se veia el avatar “L”, 
pero el render server del header todavía no veía la sesión actualizada hasta que hacías refresh manual. 
Era un desfasaje cliente/servidor.
*/
import { SignedIn } from "@clerk/nextjs";
import { ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/carrito", label: "Mi carrito", icon: ShoppingCart },
  { href: "/compras", label: "Mis compras", icon: ShoppingBag },
  { href: "/perfil", label: "Perfil", icon: UserRound }
];

export function AuthNavLinks() {
  return (
    <SignedIn>
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-lama-cream/65 focus:outline-none focus:ring-2 focus:ring-lama-ink"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </SignedIn>
  );
}
