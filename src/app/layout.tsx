import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Lama Buyer - Marketplace de Ropa Usada',
  description: 'Compra ropa usada y vintage en nuestro marketplace',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const interSans = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

/*export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased`}>
        <ClerkProvider>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}*/


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
