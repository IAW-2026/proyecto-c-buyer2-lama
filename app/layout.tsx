import type { Metadata } from "next";
import { Header } from "@/components/Header";
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
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
