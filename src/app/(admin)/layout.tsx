import { ReactNode } from 'react';
import { auth, redirectToSignIn } from '@clerk/nextjs/server';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <div className="min-h-screen bg-lama-light">
      {children}
    </div>
  );
}
