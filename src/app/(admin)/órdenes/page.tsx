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
  comprador: {
    nombreComprador: string;
    email: string;
  };
}

export default function OrdenesAdminPage() {
  const [ordenes, setOrdenes] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchOrdenes();
  }, [page, filtroEstado]);

  async function fetchOrdenes() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (filtroEstado) params.append('estado', filtroEstado);

      const response = await fetch(`/api/admin/órdenes?${params}`);
      const data = await response.json();

      setOrdenes(data.ordenes);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching órdenes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-lama-dark">
              Gestión de Órdenes
            </h1>
            <p className="text-lama-secondary">
              Total: {total} órdenes
            </p>
          </div>
          <Link href="/admin/dashboard" className="btn-secondary">
            Volver al Dashboard
          </Link>
        </div>

        {/* Filtro Estado */}
        <div className="mb-6">
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPage(1);
            }}
            className="input-base w-full max-w-md"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lama-secondary">Cargando órdenes...</p>
          </div>
        ) : ordenes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lama-secondary">No hay órdenes</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-lama-card border-b border-lama-secondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Número de Orden
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Comprador
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Monto Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((orden, idx) => (
                    <tr
                      key={orden.id}
                      className={`border-b border-lama-secondary ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-lama-light'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-lama-dark font-semibold">
                        {orden.numeroOrden}
                      </td>
                      <td className="px-6 py-4 text-sm text-lama-secondary">
                        <div>
                          <p className="font-semibold">{orden.comprador.nombreComprador}</p>
                          <p className="text-xs">{orden.comprador.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-lama-primary">
                        ${orden.montoTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${getEstadoColor(
                            orden.estado
                          )}`}
                        >
                          {orden.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-lama-secondary">
                        {new Date(orden.createdAt).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/admin/órdenes/${orden.id}`}
                          className="text-lama-primary hover:text-lama-secondary font-semibold"
                        >
                          Ver Detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-lama-card rounded hover:bg-lama-secondary hover:text-white disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded ${
                      page === p
                        ? 'bg-lama-primary text-white'
                        : 'bg-lama-card hover:bg-lama-secondary hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="px-4 py-2 bg-lama-card rounded hover:bg-lama-secondary hover:text-white disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
