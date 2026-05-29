import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Ruler, Store } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CheckoutForm } from "@/components/CheckoutForm";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ButtonLink, Card, PageShell, StatusBadge } from "@/components/ui";
import { canAccessBuyerApp } from "@/lib/auth";
import { getBuyer } from "@/lib/buyer-store";
import { fetchInternalApi } from "@/lib/external-client";
import { isFavoriteProduct } from "@/lib/favorites-store";
import { getBuyerRouteAuthContext } from "@/lib/role-guards";
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
  const authContext = await getBuyerRouteAuthContext();
  let product: Product;

  try {
    product = await fetchInternalApi<Product>(`/api/productos/${producto_id}`);
  } catch {
    notFound();
  }

  const methods = await fetchInternalApi<PaymentMethod[]>("/api/metodos-pago");
  const hasBuyerRole = canAccessBuyerApp(authContext);
  const buyerProfile = authContext.userId && hasBuyerRole ? await getBuyer(authContext.userId) : null;
  const isAccountActive = buyerProfile?.esta_activo ?? true;
  const canUseBuyerActions = Boolean(authContext.userId && authContext.email && hasBuyerRole && isAccountActive);
  const seller = sellers.find((item) => item.clerk_user_id_vendedor === product.clerk_user_id_vendedor);
  const category = categories.find((item) => item.categoria_producto_id === product.categoria_id);
  const isProductAvailable = product.estado_publicacion === "activa";
  const productPath = `/productos/${product.producto_id}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(productPath)}`;
  const initialFavorite =
    authContext.userId && hasBuyerRole
      ? await isFavoriteProduct(authContext.userId, product.producto_id)
      : false;

  return (
    <PageShell
      title={product.titulo}
      eyebrow="Detalle de producto"
      titleClassName="font-display"
      actions={
        <ButtonLink href="/productos" className="bg-lama-card text-lama-ink hover:bg-lama-cream">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </ButtonLink>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,672px)_380px] lg:justify-center lg:gap-5">
        <div className="space-y-4">
          <ProductImageGallery images={product.imagenes} title={product.titulo} />

          {isProductAvailable && canUseBuyerActions ? (
            <CheckoutForm
              product={product}
              methods={methods}
              buyer={{
                clerk_user_id_comprador: authContext.userId!,
                nombre: buyerProfile?.nombre_comprador ?? authContext.name ?? "",
                email: authContext.email!,
                DNI: buyerProfile?.DNI ?? "",
                direccion_envio: buyerProfile?.direccion_envio ?? ""
              }}
            />
          ) : null}
        </div>

        <aside className="space-y-4">
          <Card>
            <p className="text-3xl font-bold">{currency.format(product.precio)}</p>
            <div className="mt-5">
              <FavoriteButton
                productId={product.producto_id}
                productTitle={product.titulo}
                initialFavorite={initialFavorite}
                isAuthenticated={Boolean(authContext.userId && hasBuyerRole)}
                isAccountActive={isAccountActive}
                isAvailable={isProductAvailable}
                variant="wide"
                redirectTo={productPath}
              />
            </div>
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
                    {product.talle} - {product.marca}
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
              {category ? (
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-lama-detail" aria-hidden="true" />
                  <div>
                    <dt className="font-bold">Categoria</dt>
                    <dd>{category.nombre}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </Card>

          <Card>
            <div className="flex flex-wrap gap-2">
              {!isProductAvailable ? <StatusBadge>No disponible</StatusBadge> : null}
              <StatusBadge>{product.estado_prenda}</StatusBadge>
            </div>
            <p className="mt-5 text-base leading-7">{product.descripcion}</p>
          </Card>

          {!isProductAvailable ? (
            <Card>
              <p className="font-bold">Este producto no esta disponible para comprar, agregar al carrito o guardar en favoritos.</p>
            </Card>
          ) : canUseBuyerActions ? (
            <AddToCartButton product={product} />
          ) : authContext.userId && authContext.email && hasBuyerRole && !isAccountActive ? (
            <Card>
              <p className="font-bold">Tu cuenta esta desactivada.</p>
              <p className="mt-2 text-sm text-lama-ink/70">
                No podes comprar, agregar al carrito ni guardar favoritos hasta que un administrador la active.
              </p>
            </Card>
          ) : authContext.userId ? (
            <Card>
              <p className="font-bold">Necesitas rol comprador para comprar, agregar al carrito o guardar favoritos.</p>
            </Card>
          ) : (
            <Card>
              <p className="font-bold">Necesitas iniciar sesion o registrarte para comprar, agregar al carrito o guardar favoritos.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href={signInHref}>Iniciar sesion</ButtonLink>
                <ButtonLink href="/sign-up" className="bg-lama-cream text-lama-ink hover:bg-lama-card">
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
