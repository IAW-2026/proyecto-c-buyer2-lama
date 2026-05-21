import Link from "next/link";
import { Instagram, Mail, MapPin} from "lucide-react";

const footerSections = [
  {
    title: "Comprar",
    links: [
      { label: "Buscar productos", href: "/" },
      { label: "Mi carrito", href: "/carrito" },
      { label: "Mis compras", href: "/compras" }
    ]
  },
  {
    title: "Ayuda",
    links: [
      { label: "Perfil comprador", href: "/perfil" },
      { label: "Estado de envios", href: "/compras" },
      { label: "Medios de pago", href: "/carrito" }
    ]
  },
  {
    title: "Acerca de Lama",
    links: [
      { label: "Quienes somos", href: "/" },
      { label: "Moda circular", href: "/" },
      { label: "Marketplace de segunda mano", href: "/" }
    ]
  },
  {
    title: "Novedades Lama",
    links: [
      { label: "Camperas", href: "/?categoria=cat_camperas" },
      { label: "Vestidos", href: "/?categoria=cat_vestidos" },
      { label: "Pantalones", href: "/?categoria=cat_pantalones" }
    ]
  }
];

const legalLinks = [
  { label: "Terminos y condiciones", href: "/" },
  { label: "Politica de privacidad", href: "/" },
  { label: "Defensa de las y los consumidores", href: "/" }
];

export function Footer() {
  return (
    <footer className="mt-12 bg-neutral-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        {footerSections.map((section) => (
          <section key={section.title} aria-labelledby={`footer-${section.title}`}>
            <h2 id={`footer-${section.title}`} className="text-sm font-bold uppercase tracking-wide text-white">
              {section.title}
            </h2>
            <ul className="mt-5 space-y-4">
              {section.links.map((link) => (
                <li key={`${section.title}-${link.label}`}>
                  <Link href={link.href} className="text-sm font-semibold text-stone-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-label="Redes sociales" className="flex gap-3 lg:justify-end">
          <a
            href="mailto:soporte@lama.test"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-700 text-neutral-950 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Contactar por email"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-700 text-neutral-950 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Instagram de Lama"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-700 text-neutral-950 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="YouTube de Lama"
          >
          </a>
        </section>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-stone-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1 font-bold text-white">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Argentina
            </span>
            <span>© 2026 Lama. Todos los derechos reservados.</span>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Informacion legal">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
