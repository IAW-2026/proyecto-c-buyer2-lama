"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

export type BillingDetails = {
  email: string;
  nombre: string;
  DNI: string;
  direccion_envio: string;
};

export function BillingDetailsModal({
  initialDetails,
  isPending,
  onClose,
  onConfirm
}: {
  initialDetails: BillingDetails;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (details: BillingDetails) => void;
}) {
  const [details, setDetails] = useState<BillingDetails>({
    email: initialDetails.email,
    nombre: initialDetails.nombre,
    DNI: initialDetails.DNI,
    direccion_envio: initialDetails.direccion_envio
  });

  function updateField(field: keyof BillingDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  function submitBillingDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConfirm({
      email: details.email.trim(),
      nombre: details.nombre.trim(),
      DNI: details.DNI.trim(),
      direccion_envio: details.direccion_envio.trim()
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lama-ink/45 px-4 py-6">
      <form
        onSubmit={submitBillingDetails}
        className="w-full max-w-lg rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Datos del comprador</h2>
            <p className="mt-1 text-sm text-lama-ink/70">Revisalos antes de confirmar la compra.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-lama-cream focus:outline-none focus:ring-2 focus:ring-lama-detail"
            aria-label="Cerrar datos de facturacion"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold">
            Nombre
            <input
              value={details.nombre}
              onChange={(event) => updateField("nombre", event.target.value)}
              className="mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
              required
            />
          </label>
          <label className="text-sm font-bold">
            Email
            <input
              value={details.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
              required
            />
          </label>
          <label className="text-sm font-bold sm:col-span-2">
            DNI
            <input
              value={details.DNI}
              onChange={(event) => updateField("DNI", event.target.value)}
              className="mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
              required
            />
          </label>
          <label className="text-sm font-bold sm:col-span-2">
            Dirección de envío
            <textarea
              value={details.direccion_envio}
              onChange={(event) => updateField("direccion_envio", event.target.value)}
              className="mt-1 min-h-20 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-3 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Guardar datos
        </button>
      </form>
    </div>
  );
}
