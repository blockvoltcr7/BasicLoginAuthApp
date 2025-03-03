
import { ResetPasswordForm } from "@/components/auth-forms";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { useEffect, useState } from 'react';

export default function ResetPasswordPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  // Fix: Use window.location.search to get the query parameters correctly
  const token = new URLSearchParams(window.location.search).get('token');
  const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] = useState(false);

  console.log("[ResetPasswordPage] Initializing with:", {
    hasUser: !!user,
    currentUrl: window.location.href,
    hasToken: !!token,
    location,
    searchParams: window.location.search
  });

  // Redirect to home page if user successfully resets their password
  useEffect(() => {
    if (isPasswordResetSuccessful) {
      console.log("[ResetPasswordPage] Password reset successful, redirecting to home");
      window.location.href = "/";
    }
  }, [isPasswordResetSuccessful]);

  if (user) {
    console.log("[ResetPasswordPage] User already logged in, you cannot reset your password.");
    return <div>You are already logged in.</div>;
  }

  if (!token) {
    console.log("[ResetPasswordPage] No token found, you cannot reset your password.");
    return <div>No token found. Please check your reset link.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Create a new password for your account. Make sure it's secure and unique.
          </p>
        </div>
        <ResetPasswordForm token={token} onSuccess={() => setIsPasswordResetSuccessful(true)} />
      </Card>
    </div>
  );
}
