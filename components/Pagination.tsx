import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildHref(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "page") {
      params.set(key, value);
    }
  });
  params.set("page", String(page));
  return `?${params.toString()}`;
}

export function Pagination({
  page,
  pageSize,
  total,
  searchParams
}: {
  page: number;
  pageSize: number;
  total: number;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <nav className="mt-8 flex items-center justify-between" aria-label="Paginacion">
      <p className="text-sm text-lama-ink/60">
        Página {page} de {totalPages} · {total} resultados
      </p>
      <div className="flex gap-2">
        <Link
          aria-disabled={page <= 1}
          href={buildHref(searchParams, Math.max(page - 1, 1))}
          className="inline-flex items-center gap-2 rounded-xl border border-lama-line px-4 py-2.5 text-sm font-bold transition-all hover:border-lama-detail/50 hover:bg-lama-card aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Anterior
        </Link>
        <Link
          aria-disabled={page >= totalPages}
          href={buildHref(searchParams, Math.min(page + 1, totalPages))}
          className="inline-flex items-center gap-2 rounded-xl border border-lama-line px-4 py-2.5 text-sm font-bold transition-all hover:border-lama-detail/50 hover:bg-lama-card aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
