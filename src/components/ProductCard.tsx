'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  titulo: string;
  precio: number;
  imagenUrl: string;
  marca: string;
  talle: string;
  estado: string;
  categoria: string;
}

export function ProductCard({
  id,
  titulo,
  precio,
  imagenUrl,
  marca,
  talle,
  estado,
  categoria,
}: ProductCardProps) {
  return (
    <Link href={`/productos/${id}`}>
      <div className="bg-lama-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow hover:scale-105 cursor-pointer">
        <div className="relative h-48 w-full bg-lama-light">
          <Image
            src={imagenUrl}
            alt={titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-lama-secondary mb-1">{marca}</p>
          <h3 className="font-semibold text-lama-dark mb-2 line-clamp-2">{titulo}</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-lama-primary">${precio}</span>
            <span className="text-xs bg-lama-primary text-white px-2 py-1 rounded">
              {talle}
            </span>
          </div>
          <div className="flex justify-between text-xs text-lama-secondary">
            <span>{categoria}</span>
            <span
              className={`px-2 py-1 rounded ${
                estado === 'excelente'
                  ? 'bg-green-100 text-green-700'
                  : estado === 'buen estado'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {estado}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
