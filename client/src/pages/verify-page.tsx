import { useEffect } from "react";
import { useLocation, useLocation as useWouterLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/auth/verify");
  const { toast } = useToast();

  useEffect(() => {
    async function verifyToken() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get("token");
        
        if (!token) {
          throw new Error("No token provided");
        }

        const res = await apiRequest("GET", `/api/verify?token=${token}`);
        const user = await res.json();
        
        // Update the auth state
        queryClient.setQueryData(["/api/user"], user);
        
        // Redirect to home page
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
      <span className="ml-2">Verifying your login...</span>
    </div>
  );
}
