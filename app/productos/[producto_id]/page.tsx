import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Ruler, Store } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ButtonLink, Card, PageShell, StatusBadge } from "@/components/ui";
import { canAccessBuyerApp, getAuthContext } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import { fetchInternalApi } from "@/lib/external-client";
import { categories, sellers } from "@/lib/mock-external";
import type { PaymentMethod, Product } from "@/lib/types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export default async function ProductPage({
  params
}: {
  params: Promise<{ producto_id: string }>;
}) {
  const { producto_id } = await params;
  let product: Product;

  try {
    product = await fetchInternalApi<Product>(`/api/productos/${producto_id}`);
  } catch {
    notFound();
  }

  const methods = await fetchInternalApi<PaymentMethod[]>("/api/metodos-pago");
  const authContext = await getAuthContext();
  const hasBuyerRole = canAccessBuyerApp(authContext);
  const buyerProfile = authContext.userId && hasBuyerRole ? await getBuyer(authContext.userId) : null;
  const seller = sellers.find((item) => item.clerk_user_id_vendedor === product.clerk_user_id_vendedor);
  const category = categories.find((item) => item.categoria_producto_id === product.categoria_id);

  return (
    <PageShell
      title={product.titulo}
      eyebrow="Detalle de producto"
      actions={
        <ButtonLink href="/" className="bg-lama-card text-lama-ink hover:bg-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </ButtonLink>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <ProductImageGallery images={product.imagenes} title={product.titulo} />

          {authContext.userId && authContext.email && hasBuyerRole ? (
            <CheckoutForm
              product={product}
              methods={methods}
              buyer={{
                clerk_user_id_comprador: authContext.userId,
                nombre: buyerProfile?.nombre_comprador ?? authContext.name ?? "",
                email: authContext.email,
                DNI: buyerProfile?.DNI ?? "",
                direccion_envio: buyerProfile?.direccion_envio ?? ""
              }}
            />
          ) : null}
        </div>

        <aside className="space-y-5">
          <Card>
            <p className="text-3xl font-bold">{currency.format(product.precio)}</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                <div>
                  <dt className="font-bold">Vendedor</dt>
                  <dd>{seller?.nombre_vendedor ?? product.clerk_user_id_vendedor}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Ruler className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                <div>
                  <dt className="font-bold">Talle y marca</dt>
                  <dd>
                    {product.talle} · {product.marca}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                <div>
                  <dt className="font-bold">Publicado</dt>
                  <dd>{new Date(product.fecha_creacion).toLocaleDateString("es-AR")}</dd>
                </div>
              </div>
            </dl>
          </Card>

          <Card>
            <div className="flex flex-wrap gap-2">
              <StatusBadge>{product.estado_prenda}</StatusBadge>
              <StatusBadge>{category?.nombre ?? product.categoria_id}</StatusBadge>
            </div>
            <p className="mt-5 text-base leading-7">{product.descripcion}</p>
          </Card>

          {authContext.userId && authContext.email && hasBuyerRole ? (
            <AddToCartButton product={product} />
          ) : authContext.userId ? (
            <Card>
              <p className="font-bold">Necesitas rol buyer para comprar o agregar al carrito.</p>
            </Card>
          ) : (
            <Card>
              <p className="font-bold">Necesitas iniciar sesión o registrarte para comprar o agregar al carrito.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href="/sign-in">Iniciar Sesión</ButtonLink>
                <ButtonLink href="/sign-up" className="bg-lama-cream text-lama-ink hover:bg-white">
                  Registrarme
                </ButtonLink>
              </div>
            </Card>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
