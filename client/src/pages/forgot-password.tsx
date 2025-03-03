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
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>
          <ForgotPasswordForm />
        </Card>
      </div>
    </div>
  );
}
