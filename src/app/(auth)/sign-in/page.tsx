import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lama-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lama-primary mb-2">Lama</h1>
          <p className="text-lama-secondary">Ingresa a tu cuenta</p>
        </div>
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              formButtonPrimary: 'btn-primary w-full',
              card: 'bg-lama-card',
              headerTitle: 'text-lama-dark',
              headerSubtitle: 'text-lama-secondary',
            },
          }}
        />
      </div>
    </div>
  );
}
