import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    async function verifyToken() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        console.log("[VerifyPage] Starting verification for type:", type);

        if (!token) {
          throw new Error("No token provided");
        }

        // Handle password reset token verification
        if (type === "reset-password") {
          console.log("[VerifyPage] Verifying password reset token");
          const res = await apiRequest("GET", `/api/verify?token=${token}&type=reset-password`);
          const data = await res.json();

          console.log("[VerifyPage] Password reset verification completed");

          if (res.status === 200 && data.message === "Token valid") {
            console.log("[VerifyPage] Token valid, redirecting to reset password page");

            // Use direct navigation to ensure clean state
            window.location.href = `/reset-password?token=${token}`;
            return;
          } else {
            throw new Error(data.message || "Invalid or expired token");
          }
        }

        // Handle magic link verification
        console.log("[VerifyPage] Verifying magic link token");
        const res = await apiRequest("GET", `/api/verify?token=${token}`);
        console.log("[VerifyPage] Magic link verification completed");

        if (res.status !== 200) {
          const data = await res.json();
          throw new Error(data.message || "Verification failed");
        }

        const user = await res.json();
        console.log("[VerifyPage] Magic link verified, redirecting");

        queryClient.setQueryData(["/api/user"], user);
        setLocation("/");

        toast({
          title: "Success",
          description: "You have been successfully logged in",
        });
      } catch (error) {
        console.error("[VerifyPage] Verification error:", error);
        toast({
          title: "Verification Failed",
          description: error instanceof Error ? error.message : "Failed to verify token",
          variant: "destructive",
        });
        setLocation("/auth");
      }
    }

    verifyToken();
  }, [setLocation, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Verifying your request...</span>
    </div>
  );
}