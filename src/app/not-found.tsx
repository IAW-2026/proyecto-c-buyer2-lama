'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-lama-primary mb-4">404</h1>
          <p className="text-2xl text-lama-dark mb-2">Página no encontrada</p>
          <p className="text-lama-secondary mb-8">
            Lo sentimos, la página que buscas no existe.
          </p>
          <Link href="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
