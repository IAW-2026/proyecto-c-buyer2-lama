import {
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Package,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck
} from "lucide-react";

const recentPurchases = [
  { name: "Campera Denim Vintage", brand: "Levi's", price: "$38.500", image: "/products/campera_denim.webp" },
  { name: "Blazer Negro Sastrero", brand: "Zara", price: "$45.100", image: "/products/blazer_negro.webp" },
  { name: "Jean Recto Tiro Alto", brand: "Lee", price: "$34.200", image: "/products/jean_recto.webp" }
];

const orderStatuses = [
  { label: "Pagada", count: 12, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  { label: "En camino", count: 3, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", icon: Truck },
  { label: "Entregada", count: 28, color: "bg-lama-header/15 text-lama-detail", icon: Package }
];

const analyticsData = [
  { month: "Ene", value: 40 },
  { month: "Feb", value: 65 },
  { month: "Mar", value: 50 },
  { month: "Abr", value: 80 },
  { month: "May", value: 70 },
  { month: "Jun", value: 95 }
];

export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20" aria-labelledby="dashboard-preview">
      {/* Section header */}
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
          Seguí tus compras, explorá tu historial y controlá tus pedidos desde un solo lugar.
        </p>
      </div>

      {/* Dashboard grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Products purchased */}
        <div className="group rounded-2xl border border-lama-line bg-lama-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-lama-header/15">
              <ShoppingBag className="h-5 w-5 text-lama-detail" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-lama-ink">43</p>
          <p className="mt-1 text-sm text-lama-ink/60">Productos comprados</p>
        </div>

        {/* Card 2: Monthly spend */}
        <div className="group rounded-2xl border border-lama-line bg-lama-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-lama-header/15">
              <TrendingUp className="h-5 w-5 text-lama-detail" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              +8%
            </span>
          </div>
          <p className="text-3xl font-bold text-lama-ink">$142k</p>
          <p className="mt-1 text-sm text-lama-ink/60">Total invertido</p>
        </div>

        {/* Card 3: Analytics mini chart */}
        <div className="group rounded-2xl border border-lama-line bg-lama-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-lama-header/15">
              <BarChart3 className="h-5 w-5 text-lama-detail" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold text-lama-ink/50">Últimos 6 meses</span>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1.5" style={{ height: "56px" }}>
            {analyticsData.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-lama-header/30 transition-all group-hover:bg-lama-header/50"
                  style={{ height: `${item.value * 0.56}px` }}
                />
                <span className="text-[9px] font-medium text-lama-ink/40">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Order statuses */}
        <div className="group rounded-2xl border border-lama-line bg-lama-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-lama-header/15">
              <Package className="h-5 w-5 text-lama-detail" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold text-lama-ink/50">Estado</span>
          </div>
          <div className="space-y-2.5">
            {orderStatuses.map((status) => {
              const Icon = status.icon;
              return (
                <div key={status.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${status.color}`}>
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-lama-ink/80">{status.label}</span>
                  </div>
                  <span className="text-sm font-bold text-lama-ink">{status.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent purchases */}
      <div className="mt-5 rounded-2xl border border-lama-line bg-lama-card p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lama-header/15">
              <Clock className="h-4 w-4 text-lama-detail" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-lama-ink">Compras recientes</h3>
          </div>
          <span className="text-xs font-bold text-lama-ink/40">Últimos 30 días</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {recentPurchases.map((purchase, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-lama-line/60 bg-lama-cream/50 p-3 transition hover:border-lama-detail/30"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-lama-cream">
                <img src={purchase.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-lama-ink">{purchase.name}</p>
                <p className="text-xs text-lama-ink/50">{purchase.brand}</p>
                <p className="mt-0.5 text-sm font-bold text-lama-detail">{purchase.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
