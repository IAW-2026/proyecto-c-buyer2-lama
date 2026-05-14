'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PerfilForm {
  nombreComprador: string;
  email: string;
  dni: string;
  telefono: string;
  direccionEnvio: string;
}

interface PreferenciasForm {
  tallesPreferidos: string[];
  categoriasPreferidas: string[];
  vendedoresPreferidos: string;
}

const initialForm: PerfilForm = {
  nombreComprador: '',
  email: '',
  dni: '',
  telefono: '',
  direccionEnvio: '',
};

const initialPreferencias: PreferenciasForm = {
  tallesPreferidos: [],
  categoriasPreferidas: [],
  vendedoresPreferidos: '',
};

const talleOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unico'];
const categoriaOptions = [
  'Tops',
  'Pants',
  'Dresses',
  'Skirts',
  'Outerwear',
  'Knitwear',
  'Shoes',
  'Accessories',
];

export default function PerfilPage() {
  const { user } = useUser();
  const [form, setForm] = useState<PerfilForm>(initialForm);
  const [preferencias, setPreferencias] =
    useState<PreferenciasForm>(initialPreferencias);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPerfil, setIsSavingPerfil] = useState(false);
  const [isSavingPreferencias, setIsSavingPreferencias] = useState(false);
  const [message, setMessage] = useState('');
  const [preferenciasMessage, setPreferenciasMessage] = useState('');
  const [error, setError] = useState('');
  const [preferenciasError, setPreferenciasError] = useState('');

  useEffect(() => {
    async function fetchPerfil() {
      setIsLoading(true);
      setError('');
      setPreferenciasError('');

      try {
        const [perfilResponse, preferenciasResponse] = await Promise.all([
          fetch('/api/compradores/perfil'),
          fetch('/api/compradores/preferencias'),
        ]);

        const data = await perfilResponse.json();

        if (!perfilResponse.ok) {
          throw new Error(data.error || 'No se pudo cargar el perfil');
        }

        setForm({
          nombreComprador: data.nombreComprador || user?.fullName || '',
          email: data.email || user?.primaryEmailAddress?.emailAddress || '',
          dni: data.dni || '',
          telefono: data.telefono || '',
          direccionEnvio: data.direccionEnvio || '',
        });

        const preferenciasData = await preferenciasResponse.json();

        if (!preferenciasResponse.ok) {
          throw new Error(
            preferenciasData.error || 'No se pudieron cargar las preferencias'
          );
        }

        setPreferencias({
          tallesPreferidos: preferenciasData.tallesPreferidos || [],
          categoriasPreferidas: preferenciasData.categoriasPreferidas || [],
          vendedoresPreferidos: (
            preferenciasData.vendedoresPreferidos || []
          ).join(', '),
        });
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'No se pudo cargar el perfil'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPerfil();
  }, [user]);

  const updateField = (field: keyof PerfilForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const togglePreferencia = (
    field: 'tallesPreferidos' | 'categoriasPreferidas',
    value: string
  ) => {
    setPreferencias((current) => {
      const values = current[field];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];

      return {
        ...current,
        [field]: nextValues,
      };
    });
  };

  const parseVendedores = (value: string) =>
    Array.from(
      new Set(
        value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingPerfil(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/compradores/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el perfil');
      }

      setForm({
        nombreComprador: data.nombreComprador || '',
        email: data.email || '',
        dni: data.dni || '',
        telefono: data.telefono || '',
        direccionEnvio: data.direccionEnvio || '',
      });
      setMessage('Perfil actualizado correctamente');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo actualizar el perfil'
      );
    } finally {
      setIsSavingPerfil(false);
    }
  };

  const handlePreferenciasSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSavingPreferencias(true);
    setPreferenciasMessage('');
    setPreferenciasError('');

    try {
      const payload = {
        tallesPreferidos: preferencias.tallesPreferidos,
        categoriasPreferidas: preferencias.categoriasPreferidas,
        vendedoresPreferidos: parseVendedores(
          preferencias.vendedoresPreferidos
        ),
      };

      const response = await fetch('/api/compradores/preferencias', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'No se pudieron actualizar las preferencias'
        );
      }

      setPreferencias({
        tallesPreferidos: data.tallesPreferidos || [],
        categoriasPreferidas: data.categoriasPreferidas || [],
        vendedoresPreferidos: (data.vendedoresPreferidos || []).join(', '),
      });
      setPreferenciasMessage('Preferencias actualizadas correctamente');
    } catch (saveError) {
      setPreferenciasError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudieron actualizar las preferencias'
      );
    } finally {
      setIsSavingPreferencias(false);
    }
  };

  const initials = form.nombreComprador
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-lama-light">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        <h1 className="text-3xl font-bold text-lama-dark mb-8">Mi Perfil</h1>

        <section className="bg-white p-6 md:p-8 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 pb-6 mb-6 border-b border-lama-card">
            <div className="w-16 h-16 rounded-full bg-lama-primary text-white flex items-center justify-center text-xl font-bold overflow-hidden">
              {user?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt={form.nombreComprador || 'Perfil'}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials || 'U'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-lama-dark">
                {form.nombreComprador || 'Usuario'}
              </h2>
              <p className="text-lama-secondary">{form.email}</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-lama-secondary">Cargando perfil...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-lama-dark mb-2">
                    Nombre
                  </label>
                  <input
                    className="input-base"
                    value={form.nombreComprador}
                    onChange={(event) =>
                      updateField('nombreComprador', event.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-lama-dark mb-2">
                    Email
                  </label>
                  <input
                    className="input-base bg-lama-light"
                    value={form.email}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-lama-dark mb-2">
                    DNI
                  </label>
                  <input
                    className="input-base"
                    value={form.dni}
                    onChange={(event) => updateField('dni', event.target.value)}
                    placeholder="Ingresá tu DNI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-lama-dark mb-2">
                    Teléfono
                  </label>
                  <input
                    className="input-base"
                    value={form.telefono}
                    onChange={(event) =>
                      updateField('telefono', event.target.value)
                    }
                    placeholder="Ingresá tu teléfono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-lama-dark mb-2">
                  Dirección de envío
                </label>
                <textarea
                  className="input-base min-h-24 resize-none"
                  value={form.direccionEnvio}
                  onChange={(event) =>
                    updateField('direccionEnvio', event.target.value)
                  }
                  placeholder="Ingresá tu dirección"
                  required
                />
              </div>

              {message && (
                <p className="text-sm text-lama-secondary">{message}</p>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPerfil}
                  className="btn-primary disabled:opacity-60"
                >
                  {isSavingPerfil ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}
        </section>

        {!isLoading && (
          <section className="bg-white p-6 md:p-8 rounded-lg shadow">
            <div className="pb-6 mb-6 border-b border-lama-card">
              <h2 className="text-2xl font-bold text-lama-dark">
                Preferencias
              </h2>
            </div>

            <form onSubmit={handlePreferenciasSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-lama-dark mb-3">
                  Talles preferidos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {talleOptions.map((talle) => (
                    <label
                      key={talle}
                      className="flex items-center gap-2 rounded-lg border border-lama-secondary px-3 py-2 text-sm text-lama-dark"
                    >
                      <input
                        type="checkbox"
                        checked={preferencias.tallesPreferidos.includes(talle)}
                        onChange={() =>
                          togglePreferencia('tallesPreferidos', talle)
                        }
                      />
                      {talle}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-lama-dark mb-3">
                  Categorias preferidas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoriaOptions.map((categoria) => (
                    <label
                      key={categoria}
                      className="flex items-center gap-2 rounded-lg border border-lama-secondary px-3 py-2 text-sm text-lama-dark"
                    >
                      <input
                        type="checkbox"
                        checked={preferencias.categoriasPreferidas.includes(
                          categoria
                        )}
                        onChange={() =>
                          togglePreferencia(
                            'categoriasPreferidas',
                            categoria
                          )
                        }
                      />
                      {categoria}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-lama-dark mb-2">
                  Vendedores preferidos
                </label>
                <input
                  className="input-base"
                  value={preferencias.vendedoresPreferidos}
                  onChange={(event) =>
                    setPreferencias((current) => ({
                      ...current,
                      vendedoresPreferidos: event.target.value,
                    }))
                  }
                  placeholder="seller_1, seller_2"
                />
              </div>

              {preferenciasMessage && (
                <p className="text-sm text-lama-secondary">
                  {preferenciasMessage}
                </p>
              )}
              {preferenciasError && (
                <p className="text-sm text-red-600">{preferenciasError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPreferencias}
                  className="btn-primary disabled:opacity-60"
                >
                  {isSavingPreferencias
                    ? 'Guardando...'
                    : 'Guardar preferencias'}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
