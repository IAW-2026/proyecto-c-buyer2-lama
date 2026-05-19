"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return children;
  }

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signUpForceRedirectUrl="/onboarding/buyer"
      signUpFallbackRedirectUrl="/onboarding/buyer"
      afterSignOutUrl="/sign-in"
    >
      {children}
    </ClerkProvider>
  );
}
