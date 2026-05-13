'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-lama-primary text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold"> Lama</h1>
          <nav className="flex gap-4">
            {isSignedIn ? (
              <>
                <Link href="/productos" className="hover:underline">
                  Tienda
                </Link>
                <Link href="/carrito" className="hover:underline">
                  Carrito
                </Link>
                <Link href="/pedidos" className="hover:underline">
                  Mis Pedidos
                </Link>
                <Link href="/perfil" className="hover:underline">
                  Perfil
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="hover:underline">
                  Ingresar
                </Link>
                <Link href="/sign-up" className="hover:underline">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {isSignedIn ? (
            <div>
              <h2 className="text-4xl font-bold text-lama-dark mb-6">
                Bienvenido a Lama 
              </h2>
              <p className="text-lg text-lama-secondary mb-8">
                Compra ropa usada y vintage de la mejor calidad. Descubre moda sostenible.
              </p>
              <Link
                href="/productos"
                className="inline-block bg-lama-primary text-white px-8 py-3 rounded-lg hover:bg-lama-secondary transition-colors"
              >
                Explorar Tienda
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-4xl font-bold text-lama-dark mb-6">
                ¡Bienvenido a Lama! 
              </h2>
              <p className="text-lg text-lama-secondary mb-8 max-w-2xl mx-auto">
                Descubre moda vintage y ropa usada de la mejor calidad.
                Inicia sesión para comenzar tu experiencia de compra.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="bg-lama-primary text-white px-8 py-3 rounded-lg hover:bg-lama-secondary transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-lama-card text-lama-dark px-8 py-3 rounded-lg hover:bg-lama-secondary hover:text-white transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-lama-primary text-white p-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Sobre Lama</h3>
              <p className="text-sm opacity-90">
                Marketplace especializado en compra y venta de ropa usada y vintage.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <p className="text-sm opacity-90">Email: info@lama.com</p>
              <p className="text-sm opacity-90">Teléfono: +54 11 0000-0000</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Síguenos</h3>
              <p className="text-sm opacity-90">Instagram | Facebook | Twitter</p>
            </div>
          </div>
          <div className="border-t border-lama-secondary pt-6 text-center text-sm opacity-75">
            <p>&copy; 2024 Lama Marketplace. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
