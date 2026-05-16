import { Search } from "lucide-react";
import { categories } from "@/lib/mock-external";

export function SearchBar({
  search,
  categoria,
  talle
}: {
  search?: string;
  categoria?: string;
  talle?: string;
}) {
  return (
    <form className="grid gap-3 rounded-lg border border-lama-line bg-lama-card p-4 shadow-soft md:grid-cols-[1fr_180px_140px_auto]">
      <label className="sr-only" htmlFor="search">
        Buscar producto
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lama-detail" />
        <input
          id="search"
          name="search"
          defaultValue={search}
          placeholder="Buscar por prenda, marca o vendedor"
          className="w-full rounded-md border border-lama-line bg-lama-cream py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
        />
      </div>

      <label className="sr-only" htmlFor="categoria">
        Categoria
      </label>
      <select
        id="categoria"
        name="categoria"
        defaultValue={categoria ?? ""}
        className="rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
      >
        <option value="">Todas</option>
        {categories.map((category) => (
          <option key={category.categoria_producto_id} value={category.categoria_producto_id}>
            {category.nombre}
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
        className="rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
      >
        <option value="">Talles</option>
        {["XS", "S", "M", "L", "XL"].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <button className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2">
        <Search className="h-4 w-4" aria-hidden="true" />
        Buscar
      </button>
    </form>
  );
}

