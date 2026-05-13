'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';

interface Producto {
  id: string;
  titulo: string;
  precio: number;
  imagenUrl: string;
  marca: string;
  talle: string;
  estado: string;
  categoria: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [talles, setTalles] = useState<string[]>([]);
  const [filters, setFilters] = useState({});

  const limit = 12;

  useEffect(() => {
    fetchProductos();
  }, [page, filters]);

  async function fetchProductos() {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());

      const filterObj = filters as any;
      if (filterObj.search) searchParams.append('search', filterObj.search);
      if (filterObj.categoria) searchParams.append('categoria', filterObj.categoria);
      if (filterObj.talle) searchParams.append('talle', filterObj.talle);
      if (typeof filterObj.precioMin === 'number')
        searchParams.append('precioMin', filterObj.precioMin.toString());
      if (typeof filterObj.precioMax === 'number')
        searchParams.append('precioMax', filterObj.precioMax.toString());

      const response = await fetch(
        `/api/productos?${searchParams.toString()}`
      );
      const data = await response.json();

      setProductos(data.productos || []);
      setTotal(data.total || 0);
      setCategorias(data.categorias || []);
      setTalles(data.talles || []);
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col bg-lama-light">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <h1 className="text-4xl font-bold text-lama-dark mb-8">Productos</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            categorias={categorias}
            talles={talles}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
          />

          {/* Products Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-lama-secondary">Cargando productos...</p>
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lama-secondary text-lg">
                  No hay productos que coincidan con tu búsqueda
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {productos.map((producto) => (
                    <ProductCard key={producto.id} {...producto} />
                  ))}
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
                    {Array.from({ length: pages }, (_, i) => i + 1).map(
                      (p) => (
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
                      )
                    )}
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
