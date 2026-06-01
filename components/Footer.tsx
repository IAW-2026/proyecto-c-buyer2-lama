import Link from "next/link";
import { Heart, Instagram, Mail, MapPin } from "lucide-react";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";
import { getCategories } from "@/lib/seller-service";

const baseFooterSections = [
  {
    title: "Comprar",
    links: [
      { label: "Buscar productos", href: "/productos" },
      { label: "Mi carrito", href: "/carrito" },
      { label: "Mis compras", href: "/compras" }
    ]
  },
  {
    title: "Ayuda",
    links: [
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Como comprar", href: "/como-comprar" }
    ]
  },
  {
    title: "Acerca de Lama",
    links: [
      { label: "Quienes somos", href: "/quienes-somos" }
    ]
  }
];

const legalLinks = [
  { label: "Terminos y condiciones", href: "/" },
  { label: "Politica de privacidad", href: "/" },
  { label: "Defensa de las y los consumidores", href: "/" }
];

export async function Footer() {
  const authContext = await getAuthContext();

  if (canAccessAdmin(authContext)) {
    return null;
  }

  const categories = await getCategories().catch(() => []);
  const categoryLinks = categories.slice(0, 3).map((category) => ({
    label: category.nombre,
    href: `/productos?categoria=${encodeURIComponent(category.categoria_producto_id)}`
  }));
  const footerSections = [
    ...baseFooterSections,
    {
      title: "Novedades",
      links: categoryLinks.length ? categoryLinks : [{ label: "Ver productos", href: "/productos" }]
    }
  ];

  return (
    <footer className="mt-16 border-t border-white/10 bg-lama-ink/80 text-stone-100 backdrop-blur-xl dark:bg-black/70">
      <div className="h-px bg-gradient-to-r from-transparent via-lama-header/50 to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl font-bold tracking-tight text-white">
                LAMA
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">
              El marketplace de moda circular mas importante de Argentina.
              Compra, vende y dale nueva vida a tus prendas.
            </p>
            <div className="mt-6 flex gap-2.5">
              <a
                href="mailto:soporte@lama.test"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-stone-400 transition-all hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Contactar por email"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-stone-400 transition-all hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Instagram de Lama"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <section key={section.title} aria-labelledby={`footer-${section.title}`}>
              <h2
                id={`footer-${section.title}`}
                className="text-xs font-bold uppercase tracking-[0.15em] text-white"
              >
                {section.title}
              </h2>
              <ul className="mt-5 space-y-3.5">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-stone-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-stone-300">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Argentina
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-stone-300">
              @ 2026 Lama. Todos los derechos reservados.
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Informacion legal">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
