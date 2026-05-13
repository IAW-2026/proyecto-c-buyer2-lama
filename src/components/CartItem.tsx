'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CartItemProps {
  id: string;
  titulo: string;
  precio: number;
  imagenUrl: string;
  cantidad: number;
  onCantidadChange: (cantidad: number) => void;
  onRemove: () => void;
}

export function CartItem({
  id,
  titulo,
  precio,
  imagenUrl,
  cantidad,
  onCantidadChange,
  onRemove,
}: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (newCantidad: number) => {
    if (newCantidad < 1 || newCantidad > 100) return;
    setIsLoading(true);
    await onCantidadChange(newCantidad);
    setIsLoading(false);
  };

  const handleRemove = async () => {
    setIsLoading(true);
    await onRemove();
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg p-4 flex gap-4 shadow-md mb-4">
      <div className="relative h-24 w-24 bg-lama-light rounded">
        <Image
          src={imagenUrl}
          alt={titulo}
          fill
          className="object-cover rounded"
          sizes="96px"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-lama-dark mb-1">{titulo}</h3>
        <p className="text-lama-secondary mb-3">${precio}</p>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 border border-lama-secondary rounded">
            <button
              onClick={() => handleQuantityChange(cantidad - 1)}
              disabled={isLoading || cantidad === 1}
              className="px-2 py-1 hover:bg-lama-light disabled:opacity-50"
            >
              -
            </button>
            <span className="px-3">{cantidad}</span>
            <button
              onClick={() => handleQuantityChange(cantidad + 1)}
              disabled={isLoading || cantidad === 100}
              className="px-2 py-1 hover:bg-lama-light disabled:opacity-50"
            >
              +
            </button>
          </div>
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lama-primary text-lg">
          ${(precio * cantidad).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
