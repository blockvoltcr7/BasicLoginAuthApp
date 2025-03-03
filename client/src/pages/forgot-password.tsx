import { ForgotPasswordForm } from "@/components/auth-forms";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function ForgotPasswordPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 bg-black">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
