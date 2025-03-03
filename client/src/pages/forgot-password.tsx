import { ForgotPasswordForm } from "@/components/auth-forms";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function ForgotPasswordPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <ForgotPasswordForm />
        </Card>
      </div>
      <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
        <div className="max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-lg opacity-90">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>
    </div>
  );
}