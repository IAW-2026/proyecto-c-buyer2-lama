'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Pedido {
  id: string;
  numeroOrden: string;
  estado: string;
  montoTotal: number;
  createdAt: string;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    try {
      const response = await fetch('/api/pedidos');
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'pagado':
        return 'bg-blue-100 text-blue-700';
      case 'enviado':
        return 'bg-purple-100 text-purple-700';
      case 'entregado':
        return 'bg-green-100 text-green-700';
      case 'cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando pedidos...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-lama-light">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        <h1 className="text-3xl font-bold text-lama-dark mb-8">Mis Pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lama-secondary text-lg mb-6">
              No tienes pedidos aún
            </p>
            <Link href="/productos" className="btn-primary">
              Comenzar a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <Link key={pedido.id} href={`/pedidos/${pedido.id}`}>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-lama-secondary">
                        {pedido.numeroOrden}
                      </p>
                      <p className="font-semibold text-lama-dark">
                        Pedido #{pedido.id.substring(0, 8)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${getEstadoColor(
                        pedido.estado
                      )}`}
                    >
                      {pedido.estado}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-lama-secondary">
                      {new Date(pedido.createdAt).toLocaleDateString('es-AR')}
                    </p>
                    <p className="font-bold text-lama-primary text-lg">
                      ${pedido.montoTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
