"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Save, X } from "lucide-react";
import { updateAdminBuyer, type AdminFormState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/ui";
import type { BuyerWithPreferences } from "@/lib/types";

const initialState: AdminFormState = { ok: false, message: "" };

function fieldClass() {
  return "mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail";
}

export function AdminBuyerEditForm({ buyer }: { buyer: BuyerWithPreferences }) {
  const [state, action] = useActionState(updateAdminBuyer, initialState);

  return (
    <form action={action} className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
      <input type="hidden" name="clerk_user_id_comprador" value={buyer.clerk_user_id_comprador} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Editar comprador</h2>
        <Link
          href="/admin"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-lama-line text-lama-ink hover:bg-lama-cream focus:outline-none focus:ring-2 focus:ring-lama-detail"
          aria-label="Cerrar edicion"
          title="Cerrar edicion"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-bold">
          Email
          <input className={fieldClass()} value={buyer.email} readOnly />
        </label>
        <label className="text-sm font-bold">
          Nombre
          <input
            className={fieldClass()}
            name="nombre_comprador"
            defaultValue={buyer.nombre_comprador}
            required
          />
        </label>
        <label className="text-sm font-bold">
          DNI
          <input className={fieldClass()} name="DNI" defaultValue={buyer.DNI ?? ""} />
        </label>
        <label className="text-sm font-bold">
          Telefono
          <input className={fieldClass()} name="telefono" defaultValue={buyer.telefono ?? ""} />
        </label>
        <label className="text-sm font-bold md:col-span-2">
          Direccion de envio
          <textarea
            className={fieldClass()}
            name="direccion_envio"
            defaultValue={buyer.direccion_envio ?? ""}
            rows={3}
          />
        </label>
      </div>
      <div className="mt-5">
        <SubmitButton>
          <Save className="h-4 w-4" aria-hidden="true" />
          Guardar cambios
        </SubmitButton>
      </div>
      {state.message ? (
        <p className="mt-4 text-sm font-semibold" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
