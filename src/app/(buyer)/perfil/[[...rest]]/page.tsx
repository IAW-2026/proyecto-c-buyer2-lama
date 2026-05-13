'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UserProfile } from '@clerk/nextjs';

export default function PerfilPage() {
  return (
    <div className="min-h-screen flex flex-col bg-lama-light">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        <h1 className="text-3xl font-bold text-lama-dark mb-8">Mi Perfil</h1>

        <div className="bg-white p-8 rounded-lg shadow">
          <UserProfile routing="hash" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
