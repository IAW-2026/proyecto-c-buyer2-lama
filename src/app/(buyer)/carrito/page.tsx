'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartItem } from '@/components/CartItem';

interface CartItemData {
  id: string;
  producto: {
    id: string;
    titulo: string;
    imagenUrl: string;
  };
  cantidad: number;
  precioUnitario: number;
}

export default function CarritoPage() {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCarrito();
  }, []);

  async function fetchCarrito() {
    try {
      const response = await fetch('/api/carrito');
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching carrito:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCantidadChange(itemId: string, cantidad: number) {
    try {
      await fetch('/api/carrito/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, cantidad }),
      });
      await fetchCarrito();
    } catch (error) {
      console.error('Error updating carrito:', error);
    }
  }

  async function handleRemove(itemId: string) {
    try {
      await fetch('/api/carrito/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      await fetchCarrito();
    } catch (error) {
      console.error('Error removing from carrito:', error);
    }
  }

  async function handleVaciarCarrito() {
    try {
      await fetch('/api/carrito', { method: 'DELETE' });
      setItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Error vaciar carrito:', error);
    }
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando carrito...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-lama-light">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        <h1 className="text-3xl font-bold text-lama-dark mb-8">Mi Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lama-secondary text-lg mb-6">
              Tu carrito está vacío
            </p>
            <Link href="/productos" className="btn-primary">
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  titulo={item.producto.titulo}
                  precio={item.precioUnitario}
                  imagenUrl={item.producto.imagenUrl}
                  cantidad={item.cantidad}
                  onCantidadChange={(cantidad) =>
                    handleCantidadChange(item.id, cantidad)
                  }
                  onRemove={() => handleRemove(item.id)}
                />
              ))}
            </div>

            {/* Resumen */}
            <div className="bg-lama-card p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold text-lama-dark mb-6">Resumen</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-lama-secondary">Subtotal</span>
                  <span className="font-semibold text-lama-dark">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lama-secondary">Envío</span>
                  <span className="font-semibold text-lama-dark">$15.00</span>
                </div>
                <div className="border-t border-lama-secondary pt-3 flex justify-between">
                  <span className="font-bold text-lama-dark">Total</span>
                  <span className="font-bold text-lg text-lama-primary">
                    ${(total + 15).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn-primary block text-center mb-3"
              >
                Proceder a Checkout
              </Link>
              <button
                onClick={handleVaciarCarrito}
                className="w-full btn-secondary"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
