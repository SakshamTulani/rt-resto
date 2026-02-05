import { LoginForm } from "@/modules/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-orange-500">RT Resto</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        <div className="border rounded-xl p-6 bg-card shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
