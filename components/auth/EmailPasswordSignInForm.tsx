"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import { Chrome, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ClerkError = {
  errors?: Array<{
    code?: string;
    longMessage?: string;
    message?: string;
  }>;
};

function getClerkMessage(error: unknown) {
  const clerkError = error as ClerkError;
  return (
    clerkError.errors?.[0]?.longMessage ??
    clerkError.errors?.[0]?.message ??
    "No pudimos iniciar sesion con esos datos."
  );
}

function isMissingAccountError(error: unknown) {
  const clerkError = error as ClerkError;
  const firstError = clerkError.errors?.[0];
  const code = firstError?.code ?? "";
  const message = `${firstError?.longMessage ?? ""} ${firstError?.message ?? ""}`.toLowerCase();

  return (
    code.includes("identifier_not_found") ||
    code.includes("not_found") ||
    message.includes("couldn't find") ||
    message.includes("not found") ||
    message.includes("no account")
  );
}

export function EmailPasswordSignInForm() {
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  async function signInWithGoogle() {
    if (!isLoaded) {
      return;
    }

    setIsGoogleLoading(true);
    setMessage(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding/buyer"
      });
    } catch (error) {
      setIsGoogleLoading(false);
      setMessage(getClerkMessage(error));
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: email,
        password
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        router.refresh();
        return;
      }

      setMessage("La cuenta requiere un paso adicional de autenticacion en Clerk.");
    } catch (error) {
      if (isMissingAccountError(error)) {
        const params = new URLSearchParams({
          missing_account: "1",
          email
        });
        router.push(`/sign-up?${params.toString()}`);
        return;
      }

      setMessage(getClerkMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="max-w-md rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-bold">
          Email
          <input
            className="mt-2 w-full rounded-md border border-lama-line bg-white px-3 py-2 font-normal focus:border-lama-detail focus:outline-none focus:ring-2 focus:ring-lama-detail/30"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-bold">
          Contrasena
          <input
            className="mt-2 w-full rounded-md border border-lama-line bg-white px-3 py-2 font-normal focus:border-lama-detail focus:outline-none focus:ring-2 focus:ring-lama-detail/30"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {message ? (
          <p className="rounded-md border border-lama-detail/30 bg-lama-cream px-3 py-2 text-sm font-semibold text-lama-detail">
            {message}
          </p>
        ) : null}
        <div id="clerk-captcha" data-cl-theme="light" data-cl-language="es-ES" />
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={!isLoaded || isSubmitting}
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase text-lama-ink/50">
        <span className="h-px flex-1 bg-lama-line" />
        o
        <span className="h-px flex-1 bg-lama-line" />
      </div>
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-lama-line bg-white px-4 py-2 text-sm font-bold text-lama-ink hover:bg-lama-cream focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        type="button"
        onClick={signInWithGoogle}
        disabled={!isLoaded || isGoogleLoading}
      >
        <Chrome className="h-4 w-4" aria-hidden="true" />
        {isGoogleLoading ? "Conectando..." : "Continuar con Google"}
      </button>
      <p className="mt-4 text-sm text-lama-ink/75">
        No tenes cuenta?{" "}
        <Link className="font-bold text-lama-detail hover:text-lama-ink" href="/sign-up">
          Registrate
        </Link>
      </p>
    </section>
  );
}
