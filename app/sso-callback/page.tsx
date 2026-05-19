import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signUpForceRedirectUrl="/onboarding/buyer"
      signUpFallbackRedirectUrl="/onboarding/buyer"
      unsafeMetadata={{ sourceApp: "buyer" }}
    />
  );
}
