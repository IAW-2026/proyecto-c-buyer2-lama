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
    <html lang="es">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

