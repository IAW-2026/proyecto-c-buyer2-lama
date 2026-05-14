import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Lama Buyer - Marketplace de Ropa Usada',
  description: 'Compra ropa usada y vintage en nuestro marketplace',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="bg-lama-light text-lama-dark">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
