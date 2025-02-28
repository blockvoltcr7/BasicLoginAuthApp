import { ResetPasswordForm } from "@/components/auth-forms";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";

export default function ResetPasswordPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const token = new URLSearchParams(location.split('?')[1]).get('token');

  if (user) {
    return <Redirect to="/" />;
  }

  if (!token) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-6">Set New Password</h1>
          <ResetPasswordForm token={token} />
        </Card>
      </div>
      <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
        <div className="max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-4">Almost There!</h2>
          <p className="text-lg opacity-90">
            Create a new password for your account. Make sure it's secure and unique.
          </p>
        </div>
      </div>
    </div>
  );
}
