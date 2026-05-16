"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { saveAdminBuyer, type AdminFormState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/ui";

const initialState: AdminFormState = { ok: false, message: "" };

function fieldClass() {
  return "mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail";
}

export function AdminBuyerForm() {
  const [state, action] = useActionState(saveAdminBuyer, initialState);

  return (
    <form action={action} className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
      <h2 className="text-xl font-bold">Gestionar comprador</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-bold">
          Clerk user ID
          <input className={fieldClass()} name="clerk_user_id_comprador" placeholder="user_..." required />
        </label>
        <label className="text-sm font-bold">
          Email
          <input className={fieldClass()} type="email" name="email" required />
        </label>
        <label className="text-sm font-bold">
          Nombre
          <input className={fieldClass()} name="nombre_comprador" required />
        </label>
        <label className="text-sm font-bold">
          DNI
          <input className={fieldClass()} name="DNI" required />
        </label>
        <label className="text-sm font-bold">
          Telefono
          <input className={fieldClass()} name="telefono" />
        </label>
        <label className="text-sm font-bold">
          Direccion de envio
          <input className={fieldClass()} name="direccion_envio" required />
        </label>
        <label className="text-sm font-bold">
          Talles preferidos
          <input className={fieldClass()} name="talles_preferidos" placeholder="S, M" />
        </label>
        <label className="text-sm font-bold">
          Categorias preferidas
          <input className={fieldClass()} name="categorias_preferidas" placeholder="Camperas, Vestidos" />
        </label>
        <label className="text-sm font-bold md:col-span-2">
          Vendedores preferidos
          <input className={fieldClass()} name="vendedores_preferidos" placeholder="user_seller_lama_001" />
        </label>
      </div>
      <div className="mt-5">
        <SubmitButton>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Guardar comprador
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
