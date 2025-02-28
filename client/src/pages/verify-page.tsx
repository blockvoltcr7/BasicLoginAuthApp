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

        if (!token) {
          throw new Error("No token provided");
        }

        // Handle password reset token verification
        if (type === "reset-password") {
          const res = await apiRequest("GET", `/api/verify?token=${token}&type=reset-password`);
          const data = await res.json();

          if (res.status === 200 && data.message === "Token valid") {
            // Navigate directly to reset password page
            window.location.href = `/reset-password?token=${token}`;
            return;
          } else {
            throw new Error(data.message || "Invalid or expired token");
          }
        }

        // Handle magic link verification
        const res = await apiRequest("GET", `/api/verify?token=${token}`);

        if (res.status !== 200) {
          const data = await res.json();
          throw new Error(data.message || "Verification failed");
        }

        const user = await res.json();
        queryClient.setQueryData(["/api/user"], user);
        setLocation("/");

        toast({
          title: "Success",
          description: "You have been successfully logged in",
        });
      } catch (error) {
        console.error("Verification error:", error);
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