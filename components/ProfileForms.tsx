"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction
} from "react";
import { RotateCcw, Save, Search, X } from "lucide-react";
import { savePreferences, saveProfile, type FormState } from "@/app/perfil/actions";
import { SubmitButton } from "@/components/ui";
import type { BuyerWithPreferences } from "@/lib/types";

const initialState: FormState = { ok: false, message: "" };
const adultClothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const childrenClothingSizes = Array.from({ length: 17 }, (_, index) => index.toString().padStart(2, "0"));
const shoeSizes = Array.from({ length: 23 }, (_, index) => String(index + 24));

type Option = {
  id: string;
  label: string;
};

type StringListSetter = Dispatch<SetStateAction<string[]>>;

function fieldClass() {
  return "mt-1 w-full rounded-md border border-lama-line bg-lama-cream px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lama-detail";
}

function hiddenInputs(name: string, values: string[]) {
  return values.map((value) => <input key={`${name}-${value}`} type="hidden" name={name} value={value} />);
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function optionItems(options: Option[], selectedValues: string[]) {
  const selected = new Set(selectedValues);
  return options.filter((option) => selected.has(option.id));
}

function selectedItemsWithFallback(options: Option[], selectedValues: string[]) {
  const labelsById = new Map(options.map((option) => [option.id, option.label]));
  return selectedValues.map((value) => ({
    id: value,
    label: labelsById.get(value) ?? value
  }));
}

function StatusModal({
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

function SelectedChips({
  items,
  emptyText,
  onRemove
}: {
  items: Option[];
  emptyText: string;
  onRemove: (value: string) => void;
}) {
  if (items.length === 0) {
    return <p className="mt-2 text-xs font-semibold text-lama-ink/55">{emptyText}</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-lama-line bg-lama-cream px-3 py-1 text-xs font-bold text-lama-ink"
        >
          <span className="truncate">{item.label}</span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-lama-ink/70 hover:bg-lama-line hover:text-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail"
            aria-label={`Quitar ${item.label}`}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      ))}
    </div>
  );
}

function DropdownPreferenceGroup({
  title,
  options,
  selectedValues,
  placeholder,
  emptyText,
  onAdd,
  onRemove,
  keepSelectionOrder = false
}: {
  title: string;
  options: Option[];
  selectedValues: string[];
  placeholder: string;
  emptyText: string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  keepSelectionOrder?: boolean;
}) {
  const selected = new Set(selectedValues);
  const allSelected = options.length > 0 && options.every((option) => selected.has(option.id));
  const selectedItems = keepSelectionOrder
    ? selectedItemsWithFallback(options, selectedValues)
    : optionItems(options, selectedValues);

  return (
    <fieldset>
      <legend className="text-sm font-bold">{title}</legend>
      <SelectedChips items={selectedItems} emptyText={emptyText} onRemove={onRemove} />
      <select
        className={fieldClass()}
        value=""
        disabled={allSelected}
        onChange={(event) => {
          const value = event.currentTarget.value;
          if (value) {
            onAdd(value);
          }
        }}
      >
        <option value="">{allSelected ? "Todas las opciones seleccionadas" : placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id} disabled={selected.has(option.id)}>
            {option.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
}

function SellerSearchGroup({
  sellerOptions,
  selectedSellers,
  sellerSearch,
  setSellerSearch,
  onAdd,
  onRemove
}: {
  sellerOptions: Option[];
  selectedSellers: string[];
  sellerSearch: string;
  setSellerSearch: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const selected = new Set(selectedSellers);
  const search = sellerSearch.trim().toLowerCase();
  const filteredSellerOptions = useMemo(() => {
    if (!search) {
      return [];
    }

    return sellerOptions.filter((seller) => seller.label.toLowerCase().includes(search));
  }, [sellerOptions, search]);

  return (
    <fieldset>
      <legend className="text-sm font-bold">Vendedores preferidos</legend>
      <SelectedChips
        items={selectedItemsWithFallback(sellerOptions, selectedSellers)}
        emptyText="Todavia no seleccionaste vendedores."
        onRemove={onRemove}
      />
      <div className="relative mt-2">
        <label className="sr-only" htmlFor="seller-search">
          Buscar vendedor por nombre
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lama-ink/45" />
        <input
          id="seller-search"
          className="w-full rounded-md border border-lama-line bg-lama-cream py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-lama-detail"
          value={sellerSearch}
          onChange={(event) => setSellerSearch(event.currentTarget.value)}
          placeholder="Buscar vendedor por nombre"
        />
      </div>
      {search ? (
        <div className="mt-2 max-h-44 overflow-y-auto rounded-md border border-lama-line bg-lama-cream p-2">
          {filteredSellerOptions.length > 0 ? (
            <div className="grid gap-1">
              {filteredSellerOptions.map((seller) => (
                <button
                  key={seller.id}
                  type="button"
                  disabled={selected.has(seller.id)}
                  onClick={() => {
                    onAdd(seller.id);
                    setSellerSearch("");
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold hover:bg-lama-card focus:outline-none focus:ring-2 focus:ring-lama-detail disabled:cursor-not-allowed disabled:text-lama-ink/40 disabled:hover:bg-transparent"
                >
                  {seller.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="px-3 py-2 text-sm font-semibold text-lama-ink/55">No hay vendedores con ese nombre.</p>
          )}
        </div>
      ) : null}
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
  const [profileState, profileAction, profilePending] = useActionState(saveProfile, initialState);
  const [preferencesState, preferencesAction, preferencesPending] = useActionState(savePreferences, initialState);
  const [selectedSizes, setSelectedSizes] = useState(uniqueValues(buyer.preferencias?.talles_preferidos ?? []));
  const [selectedCategories, setSelectedCategories] = useState(
    uniqueValues(buyer.preferencias?.categorias_preferidas ?? [])
  );
  const [selectedSellers, setSelectedSellers] = useState(uniqueValues(buyer.preferencias?.vendedores_preferidos ?? []));
  const [sellerSearch, setSellerSearch] = useState("");
  const [preferencesIntent, setPreferencesIntent] = useState<"save" | "clear">("save");
  const [successMessage, setSuccessMessage] = useState("");

  const adultClothingOptions = adultClothingSizes.map((size) => ({ id: size, label: size }));
  const childrenClothingOptions = childrenClothingSizes.map((size) => ({ id: size, label: size }));
  const shoeOptions = shoeSizes.map((size) => ({ id: size, label: size }));

  useEffect(() => {
    if (profileState.ok && profileState.message) {
      setSuccessMessage(profileState.message);
    }
  }, [profileState]);

  useEffect(() => {
    if (preferencesState.ok && preferencesState.message) {
      setSuccessMessage(preferencesState.message);
    }
  }, [preferencesState]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setSuccessMessage(""), 2000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  function addPreference(value: string, setValues: StringListSetter) {
    setValues((current) => (current.includes(value) ? current : [...current, value]));
  }

  function removePreference(value: string, setValues: StringListSetter) {
    setValues((current) => current.filter((item) => item !== value));
  }

  function clearSelectedPreferences() {
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSelectedSellers([]);
    setSellerSearch("");
  }

  function handleClearPreferences(event: MouseEvent<HTMLButtonElement>) {
    const confirmed = window.confirm("Seguro que queres limpiar tus preferencias?");

    if (!confirmed) {
      event.preventDefault();
      return;
    }

    setPreferencesIntent("clear");
    clearSelectedPreferences();
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
            <input className={fieldClass()} type="email" name="email" defaultValue={buyer.email} readOnly required />
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
        {profileState.message && !profileState.ok ? (
          <p className="mt-4 text-sm font-semibold text-red-700" role="status">
            {profileState.message}
          </p>
        ) : null}
      </form>

      <form action={preferencesAction} className="rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft">
        <input type="hidden" name="clerk_user_id_comprador" value={buyer.clerk_user_id_comprador} />
        {hiddenInputs("talles_preferidos", selectedSizes)}
        {hiddenInputs("categorias_preferidas", selectedCategories)}
        {hiddenInputs("vendedores_preferidos", selectedSellers)}
        <h2 className="text-xl font-bold">Preferencias</h2>

        <div className="mt-5 grid gap-4">
          <DropdownPreferenceGroup
            title="Talles de ropa para adulto"
            options={adultClothingOptions}
            selectedValues={selectedSizes}
            placeholder="Seleccionar talle de adulto"
            emptyText="Todavia no seleccionaste talles de adulto."
            onAdd={(value) => addPreference(value, setSelectedSizes)}
            onRemove={(value) => removePreference(value, setSelectedSizes)}
          />
          <DropdownPreferenceGroup
            title="Talles de ropa para niños"
            options={childrenClothingOptions}
            selectedValues={selectedSizes}
            placeholder="Seleccionar talle de niños"
            emptyText="Todavia no seleccionaste talles de niños."
            onAdd={(value) => addPreference(value, setSelectedSizes)}
            onRemove={(value) => removePreference(value, setSelectedSizes)}
          />
          <DropdownPreferenceGroup
            title="Talles de zapatillas"
            options={shoeOptions}
            selectedValues={selectedSizes}
            placeholder="Seleccionar talle de zapatillas"
            emptyText="Todavia no seleccionaste talles de zapatillas."
            onAdd={(value) => addPreference(value, setSelectedSizes)}
            onRemove={(value) => removePreference(value, setSelectedSizes)}
          />
          <DropdownPreferenceGroup
            title="Categorias"
            options={categoryOptions}
            selectedValues={selectedCategories}
            placeholder="Seleccionar categoria"
            emptyText="Todavia no seleccionaste categorias."
            keepSelectionOrder
            onAdd={(value) => addPreference(value, setSelectedCategories)}
            onRemove={(value) => removePreference(value, setSelectedCategories)}
          />
          <SellerSearchGroup
            sellerOptions={sellerOptions}
            selectedSellers={selectedSellers}
            sellerSearch={sellerSearch}
            setSellerSearch={setSellerSearch}
            onAdd={(value) => addPreference(value, setSelectedSellers)}
            onRemove={(value) => removePreference(value, setSelectedSellers)}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setPreferencesIntent("save")}
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
            onClick={handleClearPreferences}
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

      {profilePending ? <StatusModal title="Guardando tu perfil" isLoading /> : null}
      {preferencesPending ? (
        <StatusModal
          title={preferencesIntent === "clear" ? "Limpiando tus preferencias" : "Guardando tus preferencias"}
          isLoading
        />
      ) : null}
      {successMessage ? <StatusModal title={successMessage} onClose={() => setSuccessMessage("")} /> : null}
    </div>
  );
}
