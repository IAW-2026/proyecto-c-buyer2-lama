import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Card, PageShell } from "@/components/ui";

export default function SsoCallbackPage() {
  return (
    <PageShell
      title="Conectando cuenta"
      className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-md flex-col justify-center"
      headerClassName="w-full text-center"
      contentClassName="flex w-full justify-center"
    >
      <Card>
        <p className="font-bold">Estamos terminando el inicio de sesion.</p>
      </Card>
      <AuthenticateWithRedirectCallback
        signUpForceRedirectUrl="/onboarding/buyer"
        signUpFallbackRedirectUrl="/onboarding/buyer"
        unsafeMetadata={{ sourceApp: "buyer" }}
      />
    </PageShell>
  );
}
