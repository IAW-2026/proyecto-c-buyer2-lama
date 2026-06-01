import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CreditCard, MousePointerClick, ShoppingBag, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Como comprar | LAMA",
  description:
    "Guia simple para comprar productos en LAMA y finalizar el pago con Mercado Pago."
};

const steps = [
  {
    title: "Elegi tus productos",
    text: "Recorre el catalogo y abri el detalle de las prendas que te interesan.",
    icon: ShoppingBag
  },
  {
    title: "Agregalos al carrito",
    text: "Podes sumar productos al carrito o avanzar con la compra directa desde el producto.",
    icon: MousePointerClick
  },
  {
    title: "Ingresa tus datos",
    text: "Completas la informacion de contacto y envio para que podamos preparar tu pedido.",
    icon: UserRound
  },
  {
    title: "Paga con Mercado Pago",
    text: "Te redirigimos a Mercado Pago para finalizar el pago de forma segura.",
    icon: CreditCard
  },
  {
    title: "Recibi la confirmacion",
    text: "Cuando el pago se aprueba, dejamos tu compra lista y coordinamos el envio.",
    icon: CheckCircle2
  }
];

export default function ComoComprarPage() {
  return (
    <main className="relative overflow-hidden">
      <img
        src="/ayuda.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-lama-cream/85" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:px-8">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-lama-detail">
            Ayuda
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-lama-ink sm:text-5xl">
            Como comprar
          </h1>
          <p className="mt-4 text-base leading-relaxed text-lama-ink/70">
            Comprar en LAMA es simple: elegis lo que te gusta, completas tus datos
            y terminamos el pago con Mercado Pago.
          </p>
          <Link
            href="/productos"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white transition hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
          >
            Ir al catalogo
          </Link>
        </section>

        <ol className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="rounded-lg border border-lama-line bg-lama-card/95 p-5 shadow-soft backdrop-blur-sm"
              >
                <div className="flex gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lama-detail text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-lama-detail" aria-hidden="true" />
                      <h2 className="font-bold text-lama-ink">{step.title}</h2>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-lama-ink/70">
                      {step.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
