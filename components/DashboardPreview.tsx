import Link from "next/link";
import { PackageCheck, ShoppingBag } from "lucide-react";

export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20" aria-labelledby="dashboard-preview">
      <div className="mb-10 text-center sm:mb-14">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-lama-detail">
          Tu experiencia
        </p>
        <h2
          id="dashboard-preview"
          className="font-display text-3xl font-bold text-lama-ink sm:text-4xl lg:text-5xl"
        >
          Tu actividad en LAMA
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-lama-ink/60">
          Revisa tus prendas guardadas y segui el estado de tus pedidos desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-lama-detail" aria-hidden="true" />
              <h3 className="text-xl font-bold text-lama-ink">Carrito</h3>
            </div>
            <Link
              href="/carrito"
              className="text-sm font-bold text-lama-detail underline underline-offset-4 transition-colors hover:text-lama-ink"
            >
              Ir al carrito
            </Link>
          </div>

          <div className="aspect-[16/9] overflow-hidden rounded-md border border-lama-line bg-lama-cream">
            <img
              src="/carrito.png"
              alt="Vista del carrito de LAMA"
              className="h-full w-full object-cover"
            />
          </div>
        </article>

        <article className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-lama-detail" aria-hidden="true" />
              <h3 className="text-xl font-bold text-lama-ink">Mis compras</h3>
            </div>
            <Link
              href="/compras"
              className="text-sm font-bold text-lama-detail underline underline-offset-4 transition-colors hover:text-lama-ink"
            >
              Ver mis compras
            </Link>
          </div>

          <div className="aspect-[16/9] overflow-hidden rounded-md border border-lama-line bg-lama-cream">
            <img
              src="/compras.png"
              alt="Vista de mis compras en LAMA"
              className="h-full w-full object-cover"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
