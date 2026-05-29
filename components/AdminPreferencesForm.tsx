"use client";

import { useActionState, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { saveAdminPreferences, type AdminFormState } from "@/app/admin/actions";
import type { BuyerWithPreferences } from "@/lib/types";

const initialState: AdminFormState = { ok: false, message: "" };
const clothingSizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["36", "37", "38", "39"];

type Option = {
  id: string;
  label: string;
};

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

export function AdminPreferencesForm({
  buyer,
  categoryOptions,
  sellerOptions
}: {
  buyer: BuyerWithPreferences;
  categoryOptions: Option[];
  sellerOptions: Option[];
}) {
  const [state, action, isPending] = useActionState(saveAdminPreferences, initialState);
  const [selectedSizes, setSelectedSizes] = useState(buyer.preferencias?.talles_preferidos ?? []);
  const [selectedCategories, setSelectedCategories] = useState(buyer.preferencias?.categorias_preferidas ?? []);
  const [selectedSellers, setSelectedSellers] = useState(buyer.preferencias?.vendedores_preferidos ?? []);

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
  }

  return (
    <form action={action} className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
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
        <CheckboxGroup
          title="Vendedores preferidos"
          name="vendedores_preferidos"
          options={sellerOptions}
          selectedValues={selectedSellers}
          onToggle={(value, checked) => togglePreference(value, checked, setSelectedSellers)}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Guardar preferencias
        </button>
        <button
          type="submit"
          name="intent"
          value="clear"
          onClick={clearSelectedPreferences}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-cream px-4 py-2 text-sm font-bold text-lama-ink hover:bg-lama-line focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Limpiar
        </button>
      </div>

      {state.message ? (
        <p className="mt-4 text-sm font-semibold" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
