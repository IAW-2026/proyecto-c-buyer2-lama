"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { savePreferences, saveProfile, type FormState } from "@/app/perfil/actions";
import { SubmitButton } from "@/components/ui";
import type { BuyerWithPreferences } from "@/lib/types";

const initialState: FormState = { ok: false, message: "" };
const sizes = ["XS", "S", "M", "L", "XL"];

type Option = {
  id: string;
  label: string;
};

function fieldClass() {
  return "mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail";
}

function CheckboxGroup({
  title,
  name,
  options,
  selectedValues
}: {
  title: string;
  name: string;
  options: Option[];
  selectedValues: string[];
}) {
  const selected = new Set(selectedValues);

  return (
    <fieldset>
      <legend className="text-sm font-bold">{title}</legend>
      <div className="mt-2 grid gap-2 rounded-md border border-lama-line bg-lama-cream p-3 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              value={option.id}
              defaultChecked={selected.has(option.id)}
              className="h-4 w-4 rounded border-lama-line text-lama-detail focus:ring-lama-detail"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProfileForms({
  buyer,
  categoryOptions,
  sellerOptions
}: {
  buyer: BuyerWithPreferences;
  categoryOptions: Option[];
  sellerOptions: Option[];
}) {
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

        <div className="mt-5 grid gap-4">
          <CheckboxGroup
            title="Talles preferidos"
            name="talles_preferidos"
            options={sizes.map((size) => ({ id: size, label: size }))}
            selectedValues={buyer.preferencias?.talles_preferidos ?? []}
          />
          <CheckboxGroup
            title="Categorias preferidas"
            name="categorias_preferidas"
            options={categoryOptions}
            selectedValues={buyer.preferencias?.categorias_preferidas ?? []}
          />
          <CheckboxGroup
            title="Vendedores preferidos"
            name="vendedores_preferidos"
            options={sellerOptions}
            selectedValues={buyer.preferencias?.vendedores_preferidos ?? []}
          />
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
