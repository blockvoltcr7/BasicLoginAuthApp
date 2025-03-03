
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
