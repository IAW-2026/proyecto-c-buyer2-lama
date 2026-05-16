import { SignUp } from "@clerk/nextjs";
import { Card, PageShell } from "@/components/ui";
import { isClerkConfigured } from "@/lib/auth";

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <PageShell
      title="Registrate y completa tu perfil"
      eyebrow="Clerk"
      className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-2xl flex-col items-center justify-center"
      headerClassName="justify-center text-center sm:justify-center sm:items-center"
      contentClassName="flex w-full max-w-md justify-center"
    >
      {params.missing_account ? (
        <Card className="mb-5 w-full">
          <p className="font-bold">No encontramos una cuenta para ese email.</p>
          <p className="mt-2 text-sm text-lama-ink/75">
            Registrate y completa tu perfil
          </p>
        </Card>
      ) : null}
      {isClerkConfigured() ? (
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          initialValues={{ emailAddress: params.email }}
          forceRedirectUrl="/perfil"
          fallbackRedirectUrl="/perfil"
        />
      ) : (
        <Card>
          <p className="font-bold">Registro gestionado por Clerk</p>
          <p className="mt-2 text-sm text-lama-ink/75">
            Al cargar las claves de Clerk, esta pantalla habilita el registro real de usuarios.
          </p>
        </Card>
      )}
    </PageShell>
  );
}
