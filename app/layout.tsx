import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "lama Buyer App",
  description: "Buyer App aislada para marketplace de ropa usada y vintage."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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
      <body>
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
