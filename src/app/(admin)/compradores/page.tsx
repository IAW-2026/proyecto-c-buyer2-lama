'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Comprador {
  id: string;
  email: string;
  nombreComprador: string;
  telefono?: string;
  createdAt: string;
}

export default function CompradoresAdminPage() {
  const [compradores, setCompradores] = useState<Comprador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchCompradores();
  }, [page, search]);

  async function fetchCompradores() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/compradores?${params}`);
      const data = await response.json();

      setCompradores(data.compradores);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching compradores:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-lama-dark">
              Gestión de Compradores
            </h1>
            <p className="text-lama-secondary">
              Total: {total} compradores
            </p>
          </div>
          <Link href="/admin/dashboard" className="btn-secondary">
            Volver al Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por email o nombre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-base w-full max-w-md"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lama-secondary">Cargando compradores...</p>
          </div>
        ) : compradores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lama-secondary">No hay compradores</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-lama-card border-b border-lama-secondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-lama-dark">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compradores.map((comprador, idx) => (
                    <tr
                      key={comprador.id}
                      className={`border-b border-lama-secondary ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-lama-light'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-lama-dark font-semibold">
                        {comprador.nombreComprador}
                      </td>
                      <td className="px-6 py-4 text-sm text-lama-secondary">
                        {comprador.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-lama-secondary">
                        {comprador.telefono || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-lama-secondary">
                        {new Date(comprador.createdAt).toLocaleDateString(
                          'es-AR'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/admin/compradores/${comprador.id}`}
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
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
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
