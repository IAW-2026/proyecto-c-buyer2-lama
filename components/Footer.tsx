import Link from "next/link";
import { Instagram, Mail, MapPin, Heart } from "lucide-react";
import { canAccessAdmin, getAuthContext } from "@/lib/auth";

const footerSections = [
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
      { label: "Perfil comprador", href: "/perfil" },
      { label: "Estado de envíos", href: "/compras" },
      { label: "Medios de pago", href: "/carrito" }
    ]
  },
  {
    title: "Acerca de Lama",
    links: [
      { label: "Quiénes somos", href: "/" },
      { label: "Moda circular", href: "/" },
      { label: "Marketplace de segunda mano", href: "/" }
    ]
  },
  {
    title: "Novedades Lama",
    links: [
      { label: "Camperas", href: "/productos?categoria=cat_camperas" },
      { label: "Vestidos", href: "/productos?categoria=cat_vestidos" },
      { label: "Pantalones", href: "/productos?categoria=cat_pantalones" }
    ]
  }
];

const legalLinks = [
  { label: "Términos y condiciones", href: "/" },
  { label: "Política de privacidad", href: "/" },
  { label: "Defensa de las y los consumidores", href: "/" }
];

export async function Footer() {
  const authContext = await getAuthContext();

  if (canAccessAdmin(authContext)) {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-white/10 bg-lama-ink/80 text-stone-100 backdrop-blur-xl dark:bg-black/70">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-lama-header/50 to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Top row: Brand + Columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl font-bold tracking-tight text-white">
                LAMA
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">
              El marketplace de moda circular más importante de Argentina.
              Comprá, vendé y dale nueva vida a tus prendas.
            </p>
            {/* Social icons */}
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

          {/* Link columns */}
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

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-stone-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-stone-300">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Argentina
            </span>
            <span className="inline-flex items-center gap-1">
              © 2026 Lama. Hecho con
              <Heart className="h-3 w-3 text-lama-header" aria-hidden="true" />
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Información legal">
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
