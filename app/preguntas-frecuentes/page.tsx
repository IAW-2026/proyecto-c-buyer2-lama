import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, RotateCcw, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | LAMA",
  description:
    "Informacion sobre medios de pago, envios y reembolsos en LAMA."
};

const questions = [
  {
    question: "Que metodos de pago aceptan?",
    answer:
      "Trabajamos con Mercado Pago. Podes pagar con los medios disponibles en la plataforma, como tarjetas, dinero en cuenta y otras opciones habilitadas.",
    icon: CreditCard
  },
  {
    question: "Como realizan los envios?",
    answer:
      "Los envios se realizan mediante nuestra empresa propia de logistica. Una vez confirmada la compra, preparamos el pedido y coordinamos el envio.",
    icon: Truck
  },
  {
    question: "Aceptan reembolsos?",
    answer:
      "Por el momento no realizamos reembolsos. Te recomendamos revisar bien el detalle del producto antes de confirmar la compra.",
    icon: RotateCcw
  }
];

export default function PreguntasFrecuentesPage() {
  return (
    <main className="relative overflow-hidden bg-lama-cream">
      <img
        src="/ayuda.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-lama-cream/55" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-lama-detail">
            Ayuda
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-lama-ink sm:text-5xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-lama-ink/70">
            Respuestas rapidas sobre pagos, envios y condiciones de compra dentro de LAMA.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.question}
                className="rounded-lg border border-lama-line bg-lama-card/90 p-6 shadow-soft backdrop-blur-sm"
              >
                <div className="flex gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lama-detail/10 text-lama-detail">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-lama-ink">{item.question}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-lama-ink/70">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            href="/como-comprar"
            className="inline-flex items-center justify-center rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white transition hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
          >
            Ver como comprar
          </Link>
        </div>
      </div>
    </main>
  );
}
