"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Heart, Loader2 } from "lucide-react";

export function FavoriteButton({
  productId,
  productTitle,
  initialFavorite,
  isAuthenticated,
  isAccountActive = true,
  isAvailable = true,
  variant = "icon",
  redirectTo,
  className
}: {
  productId: string;
  productTitle: string;
  initialFavorite: boolean;
  isAuthenticated: boolean;
  isAccountActive?: boolean;
  isAvailable?: boolean;
  variant?: "icon" | "wide";
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(redirectTo ?? `/productos/${productId}`)}`;
  const label = isFavorite ? "Quitar de favoritos" : "Guardar en favoritos";

  if (!isAuthenticated) {
    if (variant === "wide") {
      return (
        <Link
          href={signInHref}
          className={clsx(
            "inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-cream px-4 py-3 text-sm font-bold text-lama-ink hover:bg-lama-card focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2",
            className
          )}
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          Iniciar sesion para guardar
        </Link>
      );
    }

    return (
      <Link
        href={signInHref}
        className={clsx(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-lama-ink shadow-soft transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2",
          className
        )}
        aria-label={`Iniciar sesion para guardar ${productTitle}`}
        title="Iniciar sesion para guardar"
      >
        <Heart className="h-5 w-5" aria-hidden="true" />
      </Link>
    );
  }

  if (!isAccountActive) {
    if (variant === "wide") {
      return (
        <button
          type="button"
          disabled
          className={clsx(
            "inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-lama-line bg-lama-cream px-4 py-3 text-sm font-bold text-lama-ink opacity-60",
            className
          )}
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          Cuenta desactivada
        </button>
      );
    }

    return (
      <button
        type="button"
        disabled
        className={clsx(
          "inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-white/70 bg-white/90 text-lama-ink opacity-60 shadow-soft",
          className
        )}
        aria-label={`Cuenta desactivada para guardar ${productTitle}`}
        title="Cuenta desactivada"
      >
        <Heart className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  function toggleFavorite() {
    if (!isAvailable || isPending) {
      return;
    }

    const nextFavorite = !isFavorite;
    setIsFavorite(nextFavorite);
    setMessage(null);

    startTransition(async () => {
      const response = await fetch(isFavorite ? `/api/favoritos/${productId}` : "/api/favoritos", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "content-type": "application/json" },
        body: isFavorite ? undefined : JSON.stringify({ producto_id: productId })
      });

      if (response.status === 401) {
        router.push(signInHref);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setIsFavorite(isFavorite);
        setMessage(data?.error ?? "No pudimos actualizar tus favoritos.");
        return;
      }

      router.refresh();
      setMessage(nextFavorite ? "Guardado en favoritos." : "Quitado de favoritos.");
    });
  }

  if (variant === "wide") {
    return (
      <div>
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={isPending || !isAvailable}
          className={clsx(
            "inline-flex w-full items-center justify-center gap-2 rounded-md border border-lama-line bg-lama-cream px-4 py-3 text-sm font-bold text-lama-ink hover:bg-lama-card focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Heart className={clsx("h-4 w-4", isFavorite && "fill-current text-lama-detail")} aria-hidden="true" />
          )}
          {isAvailable ? label : "No disponible"}
        </button>
        {message ? (
          <p className="mt-3 rounded-md bg-lama-cream px-3 py-2 text-sm font-semibold" role="status">
            {message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isPending || !isAvailable}
      className={clsx(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-lama-ink shadow-soft transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        isFavorite && "text-lama-detail",
        className
      )}
      aria-label={`${label} ${productTitle}`}
      title={isAvailable ? label : "No disponible"}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        <Heart className={clsx("h-5 w-5", isFavorite && "fill-current")} aria-hidden="true" />
      )}
    </button>
  );
}
