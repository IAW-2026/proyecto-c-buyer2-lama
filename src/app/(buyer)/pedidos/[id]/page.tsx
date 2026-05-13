'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PedidoDetail {
  id: string;
  numeroOrden: string;
  estado: string;
  montoProducto: number;
  montoEnvio: number;
  montoTotal: number;
  direccionEnvio: string;
  createdAt: string;
  items: any[];
  estadoEnvio?: any;
}

export default function PedidoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [pedido, setPedido] = useState<PedidoDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPedido();
  }, [params.id]);

  async function fetchPedido() {
    try {
      const response = await fetch(`/api/pedidos/${params.id}`);
      if (!response.ok) throw new Error('Pedido no encontrado');
      const data = await response.json();
      setPedido(data);
    } catch (err) {
      setError('Pedido no encontrado');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando pedido...</p>
      </div>
    );

  if (error || !pedido)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-lama-dark mb-4">
              {error}
            </h1>
            <button
              onClick={() => router.push('/pedidos')}
              className="btn-primary"
            >
              Volver a pedidos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );

  const getEstadoColor = (estado: string) => {
    const colors: { [key: string]: string } = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      pagado: 'bg-blue-100 text-blue-700',
      enviado: 'bg-purple-100 text-purple-700',
      entregado: 'bg-green-100 text-green-700',
      cancelado: 'bg-red-100 text-red-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen flex flex-col bg-lama-light">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-lama-primary hover:text-lama-secondary mb-6"
        >
          ← Volver
        </button>

        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-lama-secondary mb-1">
                {pedido.numeroOrden}
              </p>
              <h1 className="text-2xl font-bold text-lama-dark">
                Pedido #{pedido.id.substring(0, 8)}
              </h1>
            </div>
            <span
              className={`px-4 py-2 rounded text-sm font-bold ${getEstadoColor(
                pedido.estado
              )}`}
            >
              {pedido.estado.toUpperCase()}
            </span>
          </div>
          <p className="text-lama-secondary">
            Realizado: {new Date(pedido.createdAt).toLocaleDateString('es-AR')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Productos */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-lama-dark mb-4">Productos</h2>
            {pedido.items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                <div className="relative h-20 w-20 bg-lama-light rounded flex-shrink-0">
                  <Image
                    src={item.producto.imagenUrl}
                    alt={item.producto.titulo}
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-lama-dark">
                    {item.producto.titulo}
                  </p>
                  <p className="text-sm text-lama-secondary mb-2">
                    Cantidad: {item.cantidad}
                  </p>
                  <p className="font-semibold text-lama-primary">
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {/* Envío */}
            {pedido.estadoEnvio && (
              <div className="bg-white p-6 rounded-lg shadow mt-6">
                <h2 className="text-xl font-bold text-lama-dark mb-4">
                  Información de Envío
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-lama-secondary">
                      Código de Seguimiento
                    </p>
                    <p className="font-semibold text-lama-dark">
                      {pedido.estadoEnvio.codigoSeguimiento}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-lama-secondary">Empresa Logística</p>
                    <p className="font-semibold text-lama-dark">
                      {pedido.estadoEnvio.empresaLogistica}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-lama-secondary">Estado de Envío</p>
                    <p className="font-semibold text-lama-dark">
                      {pedido.estadoEnvio.estado}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="bg-lama-card p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold text-lama-dark mb-6">Resumen</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-lama-secondary">Subtotal</span>
                <span className="font-semibold text-lama-dark">
                  ${pedido.montoProducto.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lama-secondary">Envío</span>
                <span className="font-semibold text-lama-dark">
                  ${pedido.montoEnvio.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-lama-secondary pt-3 flex justify-between">
                <span className="font-bold text-lama-dark">Total</span>
                <span className="font-bold text-lg text-lama-primary">
                  ${pedido.montoTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-lama-secondary mb-2">
                Dirección de Envío
              </p>
              <p className="text-sm text-lama-dark">{pedido.direccionEnvio}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
