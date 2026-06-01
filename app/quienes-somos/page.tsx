import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Recycle, Shirt, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Quiénes somos | LAMA",
  description:
    "Conocé la mirada de LAMA sobre moda circular, prendas con historia y consumo mas consciente."
};

const values = [
  {
    title: "Prendas con historia",
    text: "Creemos que una prenda puede seguir acompaniando nuevos momentos sin perder estilo.",
    icon: Shirt
  },
  {
    title: "Compra consciente",
    text: "Buscamos que elegir segunda mano sea fácil, lindo y parte de una rutina más responsable.",
    icon: Leaf
  },
  {
    title: "Circularidad real",
    text: "Alargar la vida de la ropa ayuda a reducir descartes y a valorar lo que ya existe.",
    icon: Recycle
  }
];

export default function QuienesSomosPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <img
          src="/inicio.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/25" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
              Acerca de LAMA
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
              Quiénes somos
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
              En LAMA creemos que vestirse tambien puede ser una forma de elegir mejor.
              Creamos una experiencia simple para descubrir prendas de segunda mano,
              cuidadas y listas para seguir circulando.
            </p>
            <Link
              href="/productos"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-lama-cream"
            >
              Ver productos
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lama-detail">
              Moda circular
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-lama-ink sm:text-4xl">
              Menos descarte, más vida útil para cada prenda.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-lama-ink/75">
            <p>
              La moda circular propone alargar la vida de la ropa: reutilizar,
              comprar con criterio y evitar que prendas en buen estado terminen
              descartadas antes de tiempo.
            </p>
            <p>
              Nos interesa que comprar usado sea fácil, confiable y con estilo.
              Queremos acercar una forma de consumo más consciente, donde cada
              elección tenga sentido y cada prenda pueda encontrar una nueva historia.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-lg border border-lama-line bg-lama-card p-6 shadow-soft"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lama-detail/10 text-lama-detail">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-lama-ink">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-lama-ink/70">
                  {value.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
