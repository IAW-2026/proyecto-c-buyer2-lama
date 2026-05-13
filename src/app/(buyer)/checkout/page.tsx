'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface CartData {
  items: any[];
  total: number;
}

export default function CheckoutPage() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('mp_1');
  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCartAndMethods();
  }, []);

  async function fetchCartAndMethods() {
    try {
      const [cartRes, methodsRes] = await Promise.all([
        fetch('/api/carrito'),
        fetch('/api/mock/payments/metodos-pago'),
      ]);

      const cart = await cartRes.json();
      const methods = await methodsRes.json();

      setCartData(cart);
      setMetodosPago(methods);
    } catch (err) {
      setError('Error al cargar el checkout');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!direccion.trim()) {
      setError('Por favor ingresa una dirección de envío');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direccionEnvio: direccion,
          metodoPago,
        }),
      });

      if (!response.ok) throw new Error('Error al crear el pedido');

      const pedido = await response.json();
      router.push(`/pedidos/${pedido.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el pedido');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );

  if (!cartData || cartData.items.length === 0)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lama-secondary">El carrito está vacío</p>
        </main>
        <Footer />
      </div>
    );

  const total = cartData.total + 15;

  return (
    <div className="min-h-screen flex flex-col bg-lama-light">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        <h1 className="text-3xl font-bold text-lama-dark mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Dirección de Envío */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-lama-dark mb-4">
                  Dirección de Envío
                </h2>
                <textarea
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle, número, piso, localidad, provincia, código postal"
                  className="input-base h-24"
                  required
                />
              </div>

              {/* Método de Pago */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-lama-dark mb-4">
                  Método de Pago
                </h2>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="input-base"
                >
                  {metodosPago.map((m: any) => (
                    <option key={m.metodo_pago_id} value={m.metodo_pago_id}>
                      {m.metodo_pago} - {m.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="bg-lama-card p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold text-lama-dark mb-6">Resumen</h2>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cartData.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between pb-2 border-b border-lama-secondary"
                >
                  <div>
                    <p className="text-sm font-semibold text-lama-dark">
                      {item.producto.titulo}
                    </p>
                    <p className="text-xs text-lama-secondary">
                      x{item.cantidad}
                    </p>
                  </div>
                  <p className="font-semibold text-lama-dark">
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-lama-secondary">Subtotal</span>
                <span className="font-semibold">${cartData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lama-secondary">Envío</span>
                <span className="font-semibold">$15.00</span>
              </div>
              <div className="border-t border-lama-secondary pt-3 flex justify-between">
                <span className="font-bold text-lama-dark">Total</span>
                <span className="font-bold text-lg text-lama-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
