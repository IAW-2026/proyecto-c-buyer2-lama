"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import type { ProductSort } from "@/lib/mock-external";

type Option = {
  id: string;
  label: string;
};

export function SearchBar({
  search,
  categoria,
  talle,
  sort,
  categoryOptions
}: {
  search?: string;
  categoria?: string;
  talle?: string;
  sort?: ProductSort;
  categoryOptions: Option[];
}) {
  const clearFiltersHref = sort && sort !== "recent" ? `/?sort=${sort}` : "/";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
      <form className="grid gap-3 rounded-lg border border-lama-line bg-lama-card p-4 shadow-soft md:grid-cols-[minmax(260px,1fr)_150px_120px_auto_auto] md:items-center lg:basis-3/4">
        {sort && sort !== "recent" ? <input type="hidden" name="sort" value={sort} /> : null}

        <label className="sr-only" htmlFor="search">
          Buscar producto
        </label>
        <div className="relative h-10">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lama-detail" />
          <input
            id="search"
            name="search"
            defaultValue={search}
            placeholder="Buscar por prenda, marca o vendedor"
            className="h-10 w-full rounded-md border border-lama-line bg-lama-cream pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
          />
        </div>

        <label className="sr-only" htmlFor="categoria">
          Categoría
        </label>
        <select
          id="categoria"
          name="categoria"
          defaultValue={categoria ?? ""}
          className="h-10 rounded-md border border-lama-line bg-lama-cream px-3 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
        >
          <option value="">Todas</option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="talle">
          Talle
        </label>
        <select
          id="talle"
          name="talle"
          defaultValue={talle ?? ""}
          className="h-10 rounded-md border border-lama-line bg-lama-cream px-3 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
        >
          <option value="">Talles</option>
          {["XS", "S", "M", "L", "XL", "36", "37", "38", "39"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-lama-detail px-4 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2">
          <Search className="h-4 w-4" aria-hidden="true" />
          Buscar
        </button>
        <Link
          href={clearFiltersHref}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-lama-cream px-4 text-sm font-bold text-lama-ink hover:bg-lama-line focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Limpiar filtros
        </Link>
      </form>

      <form className="flex flex-col gap-3 rounded-lg border border-lama-line bg-lama-card p-4 shadow-soft lg:flex-1">
        {search ? <input type="hidden" name="search" value={search} /> : null}
        {categoria ? <input type="hidden" name="categoria" value={categoria} /> : null}
        {talle ? <input type="hidden" name="talle" value={talle} /> : null}
        <label className="text-sm font-bold" htmlFor="sort">
          Ordenar por
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort ?? "recent"}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="h-10 rounded-md border border-lama-line bg-lama-cream px-3 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
        >
          <option value="price_asc">Precio más bajo</option>
          <option value="price_desc">Precio más alto</option>
          <option value="recent">Agregados recientemente</option>
        </select>
      </form>
    </div>
  );
}
