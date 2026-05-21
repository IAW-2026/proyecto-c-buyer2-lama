"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { savePreferences, saveProfile, type FormState } from "@/app/perfil/actions";
import { SubmitButton } from "@/components/ui";
import type { BuyerWithPreferences } from "@/lib/types";

const initialState: FormState = { ok: false, message: "" };
const clothingSizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["36", "37", "38", "39"];

type Option = {
  id: string;
  label: string;
};

function fieldClass() {
  return "mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail";
}

function PreferenceModal({
  title,
  isLoading,
  onClose
}: {
  title: string;
  isLoading?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lama-ink/60 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-lg border border-lama-line bg-lama-card p-6 text-center shadow-soft">
        {isLoading ? (
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-lama-line border-t-lama-detail" />
        ) : null}
        <p className="text-lg font-bold text-lama-ink">{title}</p>
        {!isLoading && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-5 inline-flex items-center justify-center rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
          >
            Cerrar
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CheckboxGroup({
  title,
  name,
  options,
  selectedValues,
  onToggle
}: {
  title: string;
  name: string;
  options: Option[];
  selectedValues: string[];
  onToggle: (value: string, checked: boolean) => void;
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
              checked={selected.has(option.id)}
              onChange={(event) => onToggle(option.id, event.currentTarget.checked)}
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
  const [preferencesState, preferencesAction, preferencesPending] = useActionState(savePreferences, initialState);
  const [selectedSizes, setSelectedSizes] = useState(buyer.preferencias?.talles_preferidos ?? []);
  const [selectedCategories, setSelectedCategories] = useState(buyer.preferencias?.categorias_preferidas ?? []);
  const [selectedSellers, setSelectedSellers] = useState(buyer.preferencias?.vendedores_preferidos ?? []);
  const [sellerSearch, setSellerSearch] = useState("");
  const [showPreferencesSuccess, setShowPreferencesSuccess] = useState(false);

  const filteredSellerOptions = useMemo(() => {
    const search = sellerSearch.trim().toLowerCase();
    if (!search) {
      return sellerOptions;
    }

    return sellerOptions.filter((seller) => seller.label.toLowerCase().includes(search));
  }, [sellerOptions, sellerSearch]);

  useEffect(() => {
    if (!preferencesState.ok) {
      return;
    }

    setShowPreferencesSuccess(true);
    const timeout = window.setTimeout(() => setShowPreferencesSuccess(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [preferencesState]);

  function togglePreference(
    value: string,
    checked: boolean,
    setValues: (update: (current: string[]) => string[]) => void
  ) {
    setValues((current) => {
      if (checked) {
        return current.includes(value) ? current : [...current, value];
      }

      return current.filter((item) => item !== value);
    });
  }

  function clearSelectedPreferences() {
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSelectedSellers([]);
    setSellerSearch("");
  }

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
            title="Talles de ropa"
            name="talles_preferidos"
            options={clothingSizes.map((size) => ({ id: size, label: size }))}
            selectedValues={selectedSizes}
            onToggle={(value, checked) => togglePreference(value, checked, setSelectedSizes)}
          />
          <CheckboxGroup
            title="Talles de zapatillas"
            name="talles_preferidos"
            options={shoeSizes.map((size) => ({ id: size, label: size }))}
            selectedValues={selectedSizes}
            onToggle={(value, checked) => togglePreference(value, checked, setSelectedSizes)}
          />
          <CheckboxGroup
            title="Categorias preferidas"
            name="categorias_preferidas"
            options={categoryOptions}
            selectedValues={selectedCategories}
            onToggle={(value, checked) => togglePreference(value, checked, setSelectedCategories)}
          />
          <fieldset>
            <legend className="text-sm font-bold">Vendedores preferidos</legend>
            <label className="mt-2 block text-sm font-bold">
              Buscar vendedor por nombre
              <input
                className={fieldClass()}
                value={sellerSearch}
                onChange={(event) => setSellerSearch(event.currentTarget.value)}
                placeholder="Ej: Ana Vintage"
              />
            </label>
            <CheckboxGroup
              title="Resultados"
              name="vendedores_preferidos"
              options={filteredSellerOptions}
              selectedValues={selectedSellers}
              onToggle={(value, checked) => togglePreference(value, checked, setSelectedSellers)}
            />
          </fieldset>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={preferencesPending}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Guardar preferencias
          </button>
          <button
            type="submit"
            name="intent"
            value="clear"
            onClick={clearSelectedPreferences}
            disabled={preferencesPending}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-cream px-4 py-2 text-sm font-bold text-lama-ink hover:bg-lama-line focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpiar preferencias
          </button>
        </div>
        {preferencesState.message && !preferencesState.ok ? (
          <p className="mt-4 text-sm font-semibold text-red-700" role="status">
            {preferencesState.message}
          </p>
        ) : null}
      </form>

      {preferencesPending ? <PreferenceModal title="Guardando tus preferencias" isLoading /> : null}
      {showPreferencesSuccess ? (
        <PreferenceModal title="Preferencias guardadas exitosamente" onClose={() => setShowPreferencesSuccess(false)} />
      ) : null}
    </div>
  );
}
