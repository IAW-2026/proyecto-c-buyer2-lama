import { Search } from "lucide-react";
import { AdminBuyerForm } from "@/components/AdminBuyerForm";
import { Card, PageShell, StatusBadge } from "@/components/ui";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { getBuyerReport, listBuyers } from "@/lib/buyer-store";

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

  return (
    <PageShell title="Panel de administracion" eyebrow="Buyer App">
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
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

        <aside className="space-y-5">
          <Card>
            <h2 className="text-xl font-bold">Reporte relevante</h2>
            <p className="mt-4 text-4xl font-bold">{report.totalBuyers}</p>
            <p className="text-sm text-lama-ink/70">compradores registrados</p>
          </Card>
          <Card>
            <h2 className="text-xl font-bold">Categorias preferidas</h2>
            <ul className="mt-4 space-y-3">
              {report.topCategories.map(([category, count]) => (
                <li key={category} className="flex justify-between gap-3 text-sm">
                  <span>{category}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-xl font-bold">Talles preferidos</h2>
            <ul className="mt-4 space-y-3">
              {report.topSizes.map(([size, count]) => (
                <li key={size} className="flex justify-between gap-3 text-sm">
                  <span>{size}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}

