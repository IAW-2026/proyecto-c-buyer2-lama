'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface DashboardStats {
  totalCompradores: number;
  totalPedidos: number;
  totalProductos: number;
  ingresosTotales: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompradores: 0,
    totalPedidos: 0,
    totalProductos: 0,
    ingresosTotales: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [compradoresRes, productosRes] = await Promise.all([
        fetch('/api/admin/stats/compradores'),
        fetch('/api/productos?limit=1'),
      ]);

      const compradoresData = await compradoresRes.json();
      const productosData = await productosRes.json();

      setStats({
        totalCompradores: compradoresData.total || 0,
        totalPedidos: compradoresData.totalPedidos || 0,
        totalProductos: productosData.total || 0,
        ingresosTotales: compradoresData.ingresosTotales || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const StatCard = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number | string;
    icon: string;
  }) => (
    <div className="bg-lama-card p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lama-secondary text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-lama-primary">{value}</p>
        </div>
        <div className="text-4xl opacity-30">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-lama-dark mb-2">
            Panel de Administración
          </h1>
          <p className="text-lama-secondary">
            Gestiona compradores, productos y pedidos
          </p>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lama-secondary">Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                label="Compradores"
                value={stats.totalCompradores}
                icon="👥"
              />
              <StatCard
                label="Pedidos"
                value={stats.totalPedidos}
                icon="📦"
              />
              <StatCard
                label="Productos"
                value={stats.totalProductos}
                icon="👕"
              />
              <StatCard
                label="Ingresos Totales"
                value={`$${stats.ingresosTotales.toFixed(2)}`}
                icon="💰"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/compradores"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-bold text-lama-dark mb-2">
                  Gestionar Compradores
                </h3>
                <p className="text-lama-secondary text-sm">
                  Ver, editar y administrar usuarios compradores
                </p>
              </Link>

              <Link
                href="/admin/productos"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-bold text-lama-dark mb-2">
                  Gestionar Productos
                </h3>
                <p className="text-lama-secondary text-sm">
                  Agregar, editar y eliminar productos del catálogo
                </p>
              </Link>

              <Link
                href="/admin/órdenes"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-bold text-lama-dark mb-2">
                  Gestionar Órdenes
                </h3>
                <p className="text-lama-secondary text-sm">
                  Ver estado de pedidos y seguimiento de envíos
                </p>
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
