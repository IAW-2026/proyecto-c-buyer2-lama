import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Providers } from "@/app/providers";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LAMA — Marketplace de Moda Circular",
  description:
    "Comprá y vendé moda con historia. LAMA es el marketplace premium de ropa vintage y de segunda mano en Argentina."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem("lama-theme");
                var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                var resolvedTheme = theme || (prefersDark ? "dark" : "light");
                document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
                document.documentElement.dataset.theme = resolvedTheme;
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
}
