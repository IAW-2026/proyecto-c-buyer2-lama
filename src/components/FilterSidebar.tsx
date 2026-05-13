'use client';

import { useState } from 'react';

interface FilterSidebarProps {
  categorias: string[];
  talles: string[];
  onFilterChange: (filters: ProductoFilters) => void;
}

interface ProductoFilters {
  categoria?: string;
  talle?: string;
  precioMin?: number;
  precioMax?: number;
  search?: string;
}

export function FilterSidebar({
  categorias,
  talles,
  onFilterChange,
}: FilterSidebarProps) {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedTalle, setSelectedTalle] = useState<string>('');
  const [precioMin, setPrecioMin] = useState<string>('0');
  const [precioMax, setPrecioMax] = useState<string>('1000');
  const [search, setSearch] = useState<string>('');

  const parsePrice = (value: string) =>
    value === '' ? undefined : Number(value);

  const handleFilterChange = (nextFilters: Partial<ProductoFilters> = {}) => {
    onFilterChange({
      categoria: selectedCategoria,
      talle: selectedTalle,
      precioMin: parsePrice(precioMin),
      precioMax: parsePrice(precioMax),
      search,
      ...nextFilters,
    });
  };

  return (
    <div className="bg-lama-card p-6 rounded-lg h-fit sticky top-24">
      <h2 className="text-xl font-bold text-lama-dark mb-6">Filtros</h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-lama-dark mb-2">
          Buscar
        </label>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => {
            const nextSearch = e.target.value;
            setSearch(nextSearch);
            handleFilterChange({ search: nextSearch });
          }}
          className="input-base"
        />
      </div>

      {/* Categoría */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-lama-dark mb-2">
          Categoría
        </label>
        <select
          value={selectedCategoria}
          onChange={(e) => {
            const nextCategoria = e.target.value;
            setSelectedCategoria(nextCategoria);
            handleFilterChange({ categoria: nextCategoria });
          }}
          className="input-base"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Talle */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-lama-dark mb-2">
          Talle
        </label>
        <select
          value={selectedTalle}
          onChange={(e) => {
            const nextTalle = e.target.value;
            setSelectedTalle(nextTalle);
            handleFilterChange({ talle: nextTalle });
          }}
          className="input-base"
        >
          <option value="">Todos los talles</option>
          {talles.map((talle) => (
            <option key={talle} value={talle}>
              {talle}
            </option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-lama-dark mb-2">
          Rango de precio
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            min="0"
            value={precioMin}
            onChange={(e) => {
              const nextPrecioMin = e.target.value;
              setPrecioMin(nextPrecioMin);
              handleFilterChange({ precioMin: parsePrice(nextPrecioMin) });
            }}
            placeholder="Min"
            className="input-base w-1/2"
          />
          <input
            type="number"
            max="10000"
            value={precioMax}
            onChange={(e) => {
              const nextPrecioMax = e.target.value;
              setPrecioMax(nextPrecioMax);
              handleFilterChange({ precioMax: parsePrice(nextPrecioMax) });
            }}
            placeholder="Max"
            className="input-base w-1/2"
          />
        </div>
        <p className="text-sm text-lama-secondary">
          ${precioMin} - ${precioMax}
        </p>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setSelectedCategoria('');
          setSelectedTalle('');
          setPrecioMin('0');
          setPrecioMax('1000');
          setSearch('');
          onFilterChange({});
        }}
        className="w-full btn-secondary"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
