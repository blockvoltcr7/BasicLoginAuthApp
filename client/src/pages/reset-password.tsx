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

  // Redirect to auth page if user successfully resets their password
  useEffect(() => {
    if (isPasswordResetSuccessful) {
      console.log("[ResetPasswordPage] Password reset successful, redirecting to auth");
      window.location.href = "/auth";
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-6">Set New Password</h1>
          <ResetPasswordForm token={token} onSuccess={() => setIsPasswordResetSuccessful(true)} />
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