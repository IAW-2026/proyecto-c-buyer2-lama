import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Ban,
  CalendarDays,
  Pencil,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCheck,
  UsersRound,
  UserX
} from "lucide-react";
import { toggleBuyerStatus } from "@/app/admin/actions";
import { AdminBuyerEditForm } from "@/components/AdminBuyerForm";
import { Card, PageShell, StatusBadge } from "@/components/ui";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { getBuyer, getBuyerReport, listBuyers, type BuyerStatusFilter } from "@/lib/buyer-store";

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
    <Card className="min-h-40 p-6">
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

function buyerInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function editHref({
  buyerId,
  search,
  estado,
  page
}: {
  buyerId: string;
  search?: string;
  estado: BuyerStatusFilter;
  page: number;
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (estado !== "todos") {
    params.set("estado", estado);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  params.set("edit", buyerId);
  return `/admin?${params.toString()}`;
}

function normalizeStatus(value?: string): BuyerStatusFilter {
  if (value === "activos" || value === "inactivos") {
    return value;
  }

  return "todos";
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

  const estado = normalizeStatus(params.estado);
  const requestedPage = Number(params.page ?? 1);
  const page = Number.isFinite(requestedPage) ? requestedPage : 1;
  const buyers = await listBuyers({
    search: params.search ?? "",
    estado,
    page,
    pageSize: 8
  });
  const report = await getBuyerReport();
  const buyerToEdit = params.edit ? await getBuyer(params.edit) : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:px-6">
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-lama-detail">
            <span className="h-px w-8 bg-lama-detail/60" aria-hidden="true" />
            Buyer App
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-lama-ink sm:text-5xl">
            Panel de Administracion
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-lama-ink/70">
            Gestion de compradores, estado de cuentas, preferencias y compras.
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
          caption="registrados"
          icon={UsersRound}
        />
        <MetricCard
          title="Cuentas activas"
          value={report.activeBuyers}
          caption="pueden operar"
          icon={UserCheck}
        />
        <MetricCard
          title="Cuentas inactivas"
          value={report.inactiveBuyers}
          caption="sin acceso operativo"
          icon={UserX}
        />
        <MetricCard
          title="Ultimo mes"
          value={report.buyersLastMonth}
          caption="registrados en 30 dias"
          icon={CalendarDays}
        />
      </section>

      <div className="mt-8 space-y-5">
        <form className="grid gap-4 rounded-lg border border-lama-line bg-lama-card p-4 shadow-soft lg:grid-cols-[1fr_340px_auto_auto] lg:items-end">
          <label className="text-sm font-bold">
            Busqueda
            <input
              name="search"
              defaultValue={params.search}
              placeholder="Buscar por nombre, email o DNI"
              className="mt-2 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
            />
          </label>
          <label className="text-sm font-bold">
            Estado
            <select
              name="estado"
              defaultValue={estado}
              className="mt-2 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-lama-detail"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-detail px-5 py-3 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2">
            <Search className="h-4 w-4" aria-hidden="true" />
            Aplicar
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-md border border-lama-line bg-lama-card px-5 py-3 text-sm font-bold text-lama-ink hover:bg-lama-cream focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
          >
            Limpiar
          </Link>
        </form>

        {buyerToEdit ? <AdminBuyerEditForm buyer={buyerToEdit} /> : null}

        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <caption className="sr-only">Listado de compradores</caption>
              <thead>
                <tr className="border-b border-lama-line bg-lama-cream/60 text-[10px] uppercase tracking-[0.14em] text-lama-ink/60">
                  <th className="px-5 py-4">Comprador</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Telefono</th>
                  <th className="px-5 py-4">Fecha creacion</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {buyers.items.length ? (
                  buyers.items.map((buyer) => (
                    <tr key={buyer.clerk_user_id_comprador} className="border-b border-lama-line/70">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/compradores/${buyer.clerk_user_id_comprador}`}
                          className="flex items-center gap-3 hover:text-lama-detail"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-lama-line bg-lama-cream text-xs font-bold text-lama-ink/75">
                            {buyerInitials(buyer.nombre_comprador)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-bold">{buyer.nombre_comprador}</span>
                            <span className="block truncate text-xs text-lama-ink/55">{buyer.DNI ?? "-"}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-lama-ink/70">{buyer.email}</td>
                      <td className="px-5 py-4 text-lama-ink/70">{buyer.telefono ?? "-"}</td>
                      <td className="px-5 py-4 text-lama-ink/70">{formatDate(buyer.fecha_creacion)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          className={
                            buyer.esta_activo
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }
                        >
                          {buyer.esta_activo ? "Activa" : "Inactiva"}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={editHref({
                              buyerId: buyer.clerk_user_id_comprador,
                              search: params.search,
                              estado,
                              page
                            })}
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-lama-line bg-lama-card px-3 py-2 text-xs font-bold text-lama-ink hover:bg-lama-cream focus:outline-none focus:ring-2 focus:ring-lama-detail"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Editar
                          </Link>
                          <form action={toggleBuyerStatus}>
                            <input
                              type="hidden"
                              name="clerk_user_id_comprador"
                              value={buyer.clerk_user_id_comprador}
                            />
                            <input
                              type="hidden"
                              name="intent"
                              value={buyer.esta_activo ? "deactivate" : "activate"}
                            />
                            <button
                              className={
                                buyer.esta_activo
                                  ? "inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                                  : "inline-flex items-center justify-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                              }
                            >
                              {buyer.esta_activo ? (
                                <Ban className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                              )}
                              {buyer.esta_activo ? "Desactivar" : "Activar"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-8 text-center font-semibold text-lama-ink/60" colSpan={6}>
                      No se encontraron compradores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
