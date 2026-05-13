'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';

interface Producto {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  marca: string;
  talle: string;
  estado: string;
  categoria: string;
  stock: number;
}

export default function ProductoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProducto();
  }, [params.id]);

  async function fetchProducto() {
    try {
      const response = await fetch(`/api/productos/${params.id}`);
      if (!response.ok) throw new Error('Producto no encontrado');
      const data = await response.json();
      setProducto(data);
    } catch (err) {
      setError('Producto no encontrado');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!producto) return;

    setIsAdding(true);
    setError('');
    try {
      const response = await fetch('/api/carrito/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: producto.id,
          cantidad,
        }),
      });

      if (!response.ok) throw new Error('Error al agregar al carrito');

      setSuccess(`${producto.titulo} agregado al carrito`);
      setTimeout(() => router.push('/carrito'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar al carrito');
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );

  if (error || !producto)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-lama-dark mb-4">
              Producto no encontrado
            </h1>
            <button
              onClick={() => router.push('/productos')}
              className="btn-primary"
            >
              Volver a productos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="relative h-96 bg-lama-card rounded-lg overflow-hidden">
            <Image
              src={producto.imagenUrl}
              alt={producto.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Detalles */}
          <div>
            <p className="text-sm text-lama-secondary mb-2">{producto.marca}</p>
            <h1 className="text-3xl font-bold text-lama-dark mb-4">
              {producto.titulo}
            </h1>

            <div className="mb-6">
              <p className="text-4xl font-bold text-lama-primary mb-2">
                ${producto.precio}
              </p>
              <p className="text-lama-secondary mb-4">{producto.descripcion}</p>
            </div>

            <div className="bg-lama-card p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-lama-secondary">Talle</p>
                  <p className="font-semibold text-lama-dark">{producto.talle}</p>
                </div>
                <div>
                  <p className="text-sm text-lama-secondary">Categoría</p>
                  <p className="font-semibold text-lama-dark">
                    {producto.categoria}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-lama-secondary">Estado</p>
                  <p className="font-semibold text-lama-dark">{producto.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-lama-secondary">Stock</p>
                  <p className="font-semibold text-lama-dark">{producto.stock}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex items-center border border-lama-secondary rounded">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={isAdding}
                  className="px-3 py-2 hover:bg-lama-light"
                >
                  -
                </button>
                <span className="px-4">{cantidad}</span>
                <button
                  onClick={() =>
                    setCantidad(Math.min(producto.stock, cantidad + 1))
                  }
                  disabled={isAdding || cantidad === producto.stock}
                  className="px-3 py-2 hover:bg-lama-light"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || producto.stock === 0}
                className="flex-grow btn-primary disabled:opacity-50"
              >
                {isAdding ? 'Agregando...' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
