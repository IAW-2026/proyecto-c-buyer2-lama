import { LoadingState, PageShell } from "@/components/ui";

export default function CartLoading() {
  return (
    <PageShell title="Mi carrito" eyebrow="Productos guardados" titleClassName="font-display">
      <LoadingState text="Cargando carrito..." />
    </PageShell>
  );
}
