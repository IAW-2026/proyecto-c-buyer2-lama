import { LoadingState, PageShell } from "@/components/ui";

export default function FavoritesLoading() {
  return (
    <PageShell title="Mis favoritos" eyebrow="Productos guardados" titleClassName="font-display">
      <LoadingState text="Cargando favoritos..." />
    </PageShell>
  );
}
