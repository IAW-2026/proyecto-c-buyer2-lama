"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import type { ProductSort } from "@/lib/types";

type Option = {
  id: string;
  label: string;
};

type SortOption = {
  value: ProductSort;
  label: string;
};

const defaultSortOptions: SortOption[] = [
  { value: "price_asc", label: "Precio mas bajo" },
  { value: "price_desc", label: "Precio mas alto" },
  { value: "recent", label: "Agregados recientemente" }
];

const genderOptions = [
  { label: "Hombre", value: "hombre" },
  { label: "Mujer", value: "mujer" },
  { label: "Niños", value: "niños" }
];

function normalizeGenderValue(value?: string) {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "hombre" || normalized === "mujer" || normalized === "niños") {
    return normalized;
  }

  if (normalized === "ninos" || normalized === "niño" || normalized === "nino") {
    return "niños";
  }

  return "";
}

export function SearchBar({
  search,
  categoria,
  talle,
  genero,
  sort,
  categoryOptions,
  basePath = "/",
  sortOptions = defaultSortOptions
}: {
  search?: string;
  categoria?: string;
  talle?: string;
  genero?: string;
  sort?: ProductSort;
  categoryOptions: Option[];
  basePath?: string;
  sortOptions?: SortOption[];
}) {
  const clearFiltersHref = sort && sort !== "recent" ? `${basePath}?sort=${sort}` : basePath;
  const normalizedGender = normalizeGenderValue(genero);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <form
        action={basePath}
        className="grid gap-3 rounded-2xl border border-lama-line bg-lama-card p-4 shadow-soft sm:p-5 md:grid-cols-[minmax(220px,1fr)_140px_110px_130px_auto_auto] md:items-center lg:basis-3/4"
      >
        {sort && sort !== "recent" ? <input type="hidden" name="sort" value={sort} /> : null}

        <label className="sr-only" htmlFor="search">
          Buscar producto
        </label>
        <div className="relative h-11">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lama-detail" />
          <input
            id="search"
            name="search"
            defaultValue={search}
            placeholder="Buscar por prenda, marca o vendedor"
            className="h-11 w-full rounded-xl border border-lama-line bg-lama-cream pl-10 pr-4 text-sm outline-none transition-all focus:border-lama-detail/50 focus:ring-2 focus:ring-lama-detail/20"
          />
        </div>

        <label className="sr-only" htmlFor="categoria">
          Categoria
        </label>
        <select
          id="categoria"
          name="categoria"
          defaultValue={categoria ?? ""}
          className="h-11 rounded-xl border border-lama-line bg-lama-cream px-3 text-sm outline-none transition-all focus:border-lama-detail/50 focus:ring-2 focus:ring-lama-detail/20"
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
          className="h-11 rounded-xl border border-lama-line bg-lama-cream px-3 text-sm outline-none transition-all focus:border-lama-detail/50 focus:ring-2 focus:ring-lama-detail/20"
        >
          <option value="">Talles</option>
          {["XS", "S", "M", "L", "XL", "36", "37", "38", "39"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="genero">
          Genero
        </label>
        <select
          id="genero"
          name="genero"
          defaultValue={normalizedGender}
          className="h-11 rounded-xl border border-lama-line bg-lama-cream px-3 text-sm outline-none transition-all focus:border-lama-detail/50 focus:ring-2 focus:ring-lama-detail/20"
        >
          <option value="">Genero</option>
          {genderOptions.map((gender) => (
            <option key={gender.value} value={gender.value}>
              {gender.label}
            </option>
          ))}
        </select>

        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-lama-detail px-5 text-sm font-bold text-white transition-all hover:bg-lama-ink hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2">
          <Search className="h-4 w-4" aria-hidden="true" />
          Buscar
        </button>
        <Link
          href={clearFiltersHref}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-lama-line bg-lama-cream px-5 text-sm font-bold text-lama-ink transition-all hover:border-lama-detail/40 hover:bg-lama-card focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Limpiar
        </Link>
      </form>

      <form
        action={basePath}
        className="flex flex-col gap-3 rounded-2xl border border-lama-line bg-lama-card p-4 shadow-soft sm:p-5 lg:flex-1"
      >
        {search ? <input type="hidden" name="search" value={search} /> : null}
        {categoria ? <input type="hidden" name="categoria" value={categoria} /> : null}
        {talle ? <input type="hidden" name="talle" value={talle} /> : null}
        {normalizedGender ? <input type="hidden" name="genero" value={normalizedGender} /> : null}
        <label className="text-sm font-bold" htmlFor="sort">
          Ordenar por
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort ?? "recent"}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="h-11 rounded-xl border border-lama-line bg-lama-cream px-3 text-sm outline-none transition-all focus:border-lama-detail/50 focus:ring-2 focus:ring-lama-detail/20"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
