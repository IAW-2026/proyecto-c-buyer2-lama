"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { savePreferences, saveProfile, type FormState } from "@/app/perfil/actions";
import { SubmitButton } from "@/components/ui";
import type { BuyerWithPreferences } from "@/lib/types";

const initialState: FormState = { ok: false, message: "" };

function fieldClass() {
  return "mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail";
}

export function ProfileForms({ buyer }: { buyer: BuyerWithPreferences }) {
  const [profileState, profileAction] = useActionState(saveProfile, initialState);
  const [preferencesState, preferencesAction] = useActionState(savePreferences, initialState);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form action={profileAction} className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
        <input type="hidden" name="clerk_user_id_comprador" value={buyer.clerk_user_id_comprador} />
        <h2 className="text-xl font-bold">Datos del comprador</h2>

        <div className="mt-5 grid gap-4">
          <label className="text-sm font-bold">
            Nombre y apellido
            <input
              className={fieldClass()}
              name="nombre_comprador"
              defaultValue={buyer.nombre_comprador}
              required
            />
          </label>
          <label className="text-sm font-bold">
            Email
            <input className={fieldClass()} type="email" name="email" defaultValue={buyer.email} required />
          </label>
          <label className="text-sm font-bold">
            DNI
            <input className={fieldClass()} name="DNI" defaultValue={buyer.DNI ?? ""} required />
          </label>
          <label className="text-sm font-bold">
            Telefono
            <input className={fieldClass()} name="telefono" defaultValue={buyer.telefono ?? ""} />
          </label>
          <label className="text-sm font-bold">
            Direccion de envio
            <textarea
              className={fieldClass()}
              name="direccion_envio"
              defaultValue={buyer.direccion_envio ?? ""}
              rows={3}
              required
            />
          </label>
        </div>

        <div className="mt-5">
          <SubmitButton>
            <Save className="h-4 w-4" aria-hidden="true" />
            Guardar perfil
          </SubmitButton>
        </div>
        {profileState.message ? (
          <p className="mt-4 text-sm font-semibold" role="status">
            {profileState.message}
          </p>
        ) : null}
      </form>

      <form action={preferencesAction} className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
        <input type="hidden" name="clerk_user_id_comprador" value={buyer.clerk_user_id_comprador} />
        <h2 className="text-xl font-bold">Preferencias</h2>
        <p className="mt-1 text-sm text-lama-ink/70">Separar valores con coma.</p>

        <div className="mt-5 grid gap-4">
          <label className="text-sm font-bold">
            Talles preferidos
            <input
              className={fieldClass()}
              name="talles_preferidos"
              defaultValue={buyer.preferencias?.talles_preferidos.join(", ") ?? ""}
            />
          </label>
          <label className="text-sm font-bold">
            Categorias preferidas
            <input
              className={fieldClass()}
              name="categorias_preferidas"
              defaultValue={buyer.preferencias?.categorias_preferidas.join(", ") ?? ""}
            />
          </label>
          <label className="text-sm font-bold">
            Vendedores preferidos
            <input
              className={fieldClass()}
              name="vendedores_preferidos"
              defaultValue={buyer.preferencias?.vendedores_preferidos.join(", ") ?? ""}
            />
          </label>
        </div>

        <div className="mt-5">
          <SubmitButton>
            <Save className="h-4 w-4" aria-hidden="true" />
            Guardar preferencias
          </SubmitButton>
        </div>
        {preferencesState.message ? (
          <p className="mt-4 text-sm font-semibold" role="status">
            {preferencesState.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
