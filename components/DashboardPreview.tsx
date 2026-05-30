import Link from "next/link";
import {
  CreditCard,
  PackageCheck,
  ShoppingBag,
  Trash2,
  Truck
} from "lucide-react";

const cartItems = [
  {
    name: "Blazer Negro Sastrero",
    brand: "Zara",
    size: "S",
    description: "Blazer sastrero en excelente estado.",
    price: "$49.600",
    image: "/products/blazer_negro.webp"
  },
  {
    name: "Jean Recto Tiro Alto",
    brand: "Lee",
    size: "38",
    description: "Jean clasico de denim rigido.",
    price: "$34.200",
    image: "/products/jean_recto.webp"
  }
];

const purchaseItem = {
  order: "#ORD-0001",
  name: "Blazer negro sastrero",
  brand: "Zara",
  size: "S",
  total: "$49.600",
  address: "cabrera 1234",
  updated: "28/5/2026, 06:21:15",
  tracking: "LMA-ORD_1780003275204_ZM28QY",
  image: "/products/blazer_negro.webp"
};

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

          <div className="grid gap-5 xl:grid-cols-[1fr_220px]">
            <div className="grid gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.name}
                  className="grid gap-3 rounded-lg border border-lama-line bg-lama-cream/60 p-3 sm:grid-cols-[82px_1fr_auto]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-lama-cream">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lama-ink">{item.name}</p>
                    <p className="mt-1 text-sm text-lama-ink/70">
                      {item.brand} - Talle {item.size}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-lama-ink/75">{item.description}</p>
                    <p className="mt-2 text-lg font-bold text-lama-ink">{item.price}</p>
                  </div>
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-lama-line text-lama-ink/70"
                    aria-hidden="true"
                  >
                    <Trash2 className="h-4 w-4" />
                  </span>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-lama-line bg-lama-card p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                <h4 className="text-lg font-bold text-lama-ink">Resumen</h4>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt>Productos</dt>
                  <dd className="font-bold">2</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-bold">$83.800</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Envio</dt>
                  <dd className="font-bold">$4.500</dd>
                </div>
                <div className="flex justify-between border-t border-lama-line pt-3 text-base">
                  <dt>Total</dt>
                  <dd className="font-bold">$88.300</dd>
                </div>
              </dl>
              <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-3 text-sm font-bold text-white">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Pagar carrito
              </div>
            </aside>
          </div>
        </article>

        <article className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-lama-ink">Mis compras</h3>
            <Link
              href="/compras"
              className="text-sm font-bold text-lama-detail underline underline-offset-4 transition-colors hover:text-lama-ink"
            >
              Ver mis compras
            </Link>
          </div>

          <div className="grid gap-5 rounded-lg border border-lama-line bg-lama-cream/60 p-4 lg:grid-cols-[1fr_270px]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-xl font-bold text-lama-ink">Nro. Orden: {purchaseItem.order}</h4>
                <span className="rounded-full border border-lama-line bg-lama-card px-3 py-1 text-xs font-bold uppercase text-lama-detail">
                  Pagada
                </span>
                <span className="rounded-full border border-lama-line bg-lama-card px-3 py-1 text-xs font-bold uppercase text-lama-detail">
                  Pago aprobado
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-lama-cream">
                  <img src={purchaseItem.image} alt={purchaseItem.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-lama-ink">{purchaseItem.name}</p>
                  <p className="text-sm text-lama-ink/70">
                    {purchaseItem.brand} - Talle {purchaseItem.size}
                  </p>
                </div>
              </div>

              <dl className="grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-bold text-lama-ink">Total</dt>
                  <dd>{purchaseItem.total}</dd>
                </div>
                <div>
                  <dt className="font-bold text-lama-ink">Direccion</dt>
                  <dd>{purchaseItem.address}</dd>
                </div>
                <div>
                  <dt className="font-bold text-lama-ink">Actualizado</dt>
                  <dd>{purchaseItem.updated}</dd>
                </div>
              </dl>
            </div>

            <aside className="rounded-lg border border-lama-line bg-lama-card p-4">
              <div className="flex items-center gap-2 font-bold text-lama-ink">
                <Truck className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                Envio
              </div>
              <p className="mt-3 text-sm font-bold">Empresa a cargo del envio: lama Logistica</p>
              <p className="mt-1 break-words text-sm font-semibold">
                Codigo de Seguimiento: {purchaseItem.tracking}
              </p>
              <div className="mt-4 text-sm">
                <div className="flex items-center gap-2 font-bold text-lama-ink">
                  <PackageCheck className="h-4 w-4 text-lama-detail" aria-hidden="true" />
                  pendiente
                </div>
                <p className="ml-6 mt-1 text-lama-ink/75">Envio generado al confirmar la compra.</p>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </section>
  );
}
