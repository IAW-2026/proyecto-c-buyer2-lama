import { Card, PageShell } from "@/components/ui";
import { EmailPasswordSignInForm } from "@/components/auth/EmailPasswordSignInForm";
import { isClerkConfigured } from "@/lib/auth";

export default function SignInPage() {
  return (
    <PageShell
      title="Iniciar Sesión"
      className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-md flex-col justify-center"
      headerClassName="w-full text-center"
      contentClassName="flex w-full justify-center"
    >
      {isClerkConfigured() ? (
        <EmailPasswordSignInForm />
      ) : (
        <Card>
          <p className="font-bold">Clerk no esta configurado</p>
          <p className="mt-2 text-sm text-lama-ink/75">
          </p>
        </Card>
      )}
    </PageShell>
  );
}
