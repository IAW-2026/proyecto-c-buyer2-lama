import type { LucideIcon } from "lucide-react";
import { Ruler, Search, ShieldCheck, Tags, UserPlus, UsersRound } from "lucide-react";
import { AdminBuyerForm } from "@/components/AdminBuyerForm";
import { Card, PageShell, StatusBadge } from "@/components/ui";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { getBuyerReport, listBuyers } from "@/lib/buyer-store";
import { categories } from "@/lib/mock-external";

type RankingItem = {
  id: string;
  label: string;
  count: number;
};

function MetricCard({
  title,
  value,
  caption,
  icon: Icon
}: {
  title: string;
  value: number | string;
  caption: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="min-h-48 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lama-cream text-lama-detail">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-lama-detail/80">
        {title}
      </p>
      <p className="mt-3 text-4xl font-bold text-lama-ink">{value}</p>
      <div className="mt-5 flex items-center gap-3 text-xs font-semibold text-lama-ink/60">
        <span className="h-px w-6 bg-lama-line" aria-hidden="true" />
        {caption}
      </div>
    </Card>
  );
}

function RankingCard({
  title,
  items,
  icon: Icon
}: {
  title: string;
  items: RankingItem[];
  icon: LucideIcon;
}) {
  return (
    <Card className="min-h-48 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lama-cream text-lama-detail">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-lama-detail/80">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate font-semibold text-lama-ink/80">{item.label}</span>
              <strong className="min-w-8 rounded-full bg-lama-cream px-2.5 py-1 text-center text-lama-detail">
                {item.count}
              </strong>
            </li>
          ))
        ) : (
          <li className="text-sm font-semibold text-lama-ink/55">Sin preferencias registradas</li>
        )}
      </ul>
    </Card>
  );
}

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const authContext = await getAuthContext();
  const params = await searchParams;

  if (!canAccessAdmin(authContext)) {
    return (
      <PageShell title="Panel de administracion" eyebrow="Acceso">
        <Card>
          <p className="font-bold">Necesitas rol super_admin para administrar la Buyer App.</p>
        </Card>
      </PageShell>
    );
  }

  const buyers = await listBuyers({
    search: params.search ?? "",
    page: Number(params.page ?? 1),
    pageSize: 8
  });
  const report = await getBuyerReport();
  const categoryNames = new Map(
    categories.map((category) => [category.categoria_producto_id, category.nombre])
  );
  const topCategories = report.topCategories.map(([category, count]) => ({
    id: category,
    label: categoryNames.get(category) ?? category,
    count
  }));
  const topSizes = report.topSizes.map(([size, count]) => ({
    id: size,
    label: size,
    count
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:px-6">
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-lama-detail">
            <span className="h-px w-8 bg-lama-detail/60" aria-hidden="true" />
            Buyer App
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-lama-ink sm:text-5xl">
            Panel de Administracion
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-lama-ink/70">
            Vista general de compradores, preferencias y registros de la plataforma.
          </p>
        </div>

        <Card className="w-full max-w-xs p-4 lg:mt-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lama-cream text-lama-detail">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-lama-detail/80">
                Estado de seguridad
              </p>
              <p className="mt-1 text-sm font-bold text-lama-ink">Super Admin</p>
            </div>
          </div>
        </Card>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Resumen de compradores">
        <MetricCard
          title="Total compradores"
          value={report.totalBuyers}
          caption="compradores registrados"
          icon={UsersRound}
        />
        <MetricCard
          title="Ultimo mes"
          value={report.buyersLastMonth}
          caption="registrados en 30 dias"
          icon={UserPlus}
        />
        <RankingCard title="Categorias preferidas" items={topCategories} icon={Tags} />
        <RankingCard title="Talles preferidos" items={topSizes} icon={Ruler} />
      </section>

      <div className="mt-8 space-y-5">
        <form className="flex gap-2 rounded-lg border border-lama-line bg-lama-card p-4 shadow-soft">
          <label className="sr-only" htmlFor="search">
            Buscar comprador
          </label>
          <input
            id="search"
            name="search"
            defaultValue={params.search}
            placeholder="Buscar comprador por nombre, email o DNI"
            className="min-w-0 flex-1 rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
          />
          <button className="inline-flex items-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white">
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar
          </button>
        </form>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <caption className="sr-only">Listado de compradores</caption>
              <thead>
                <tr className="border-b border-lama-line">
                  <th className="py-3 pr-3">Comprador</th>
                  <th className="py-3 pr-3">DNI</th>
                  <th className="py-3 pr-3">Direccion</th>
                  <th className="py-3 pr-3">Preferencias</th>
                </tr>
              </thead>
              <tbody>
                {buyers.items.map((buyer) => (
                  <tr key={buyer.clerk_user_id_comprador} className="border-b border-lama-line/70">
                    <td className="py-3 pr-3">
                      <p className="font-bold">{buyer.nombre_comprador}</p>
                      <p className="text-lama-ink/70">{buyer.email}</p>
                    </td>
                    <td className="py-3 pr-3">{buyer.DNI}</td>
                    <td className="py-3 pr-3">{buyer.direccion_envio}</td>
                    <td className="py-3 pr-3">
                      <div className="flex flex-wrap gap-1">
                        {(buyer.preferencias?.categorias_preferidas ?? []).map((category) => (
                          <StatusBadge key={category}>{category}</StatusBadge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AdminBuyerForm />
      </div>
    </main>
  );
}
