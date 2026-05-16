"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border border-lama-line bg-lama-card p-6 shadow-soft">
        <p className="text-sm font-bold uppercase text-lama-detail">Manejo de errores</p>
        <h1 className="mt-2 text-3xl font-bold">Algo no salio bien</h1>
        <p className="mt-3 text-lama-ink/75">{error.message}</p>
        <button
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reintentar
        </button>
      </div>
    </div>
  );
}

