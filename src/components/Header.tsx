'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-lama-primary text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition">
          Lama
        </Link>

        <nav className="flex items-center gap-6">
          {isSignedIn && (
            <>
              <Link
                href="/productos"
                className="hover:text-lama-light transition-colors"
              >
                Tienda
              </Link>
              <Link
                href="/carrito"
                className="hover:text-lama-light transition-colors"
              >
                Carrito
              </Link>
              <Link
                href="/pedidos"
                className="hover:text-lama-light transition-colors"
              >
                Pedidos
              </Link>
              <Link
                href="/perfil"
                className="hover:text-lama-light transition-colors"
              >
                Perfil
              </Link>
            </>
          )}
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </nav>
      </div>
    </header>
  );
}
