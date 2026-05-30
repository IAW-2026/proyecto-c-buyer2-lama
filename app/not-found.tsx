import { Home } from "lucide-react";
import { ButtonLink, PageShell } from "@/components/ui";

export default function NotFound() {
  return (
    <PageShell
      title="Pagina no encontrada"
      eyebrow="Error 404"
      actions={
        <ButtonLink href="/">
          <Home className="h-4 w-4" aria-hidden="true" />
          Ir al catalogo
        </ButtonLink>
      }
    >
      <p className="max-w-2xl text-lama-ink/75">
        La ruta solicitada no existe dentro de la app.
      </p>
    </PageShell>
  );
}

