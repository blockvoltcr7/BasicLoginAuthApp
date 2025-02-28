import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: () => React.JSX.Element;
  requireAdmin?: boolean;
};

export function ProtectedRoute({ path, component: Component, requireAdmin }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Allow public access to auth-related routes
  const isPublicRoute = path.startsWith("/verify") || 
                       path.startsWith("/reset-password") || 
                       path.startsWith("/forgot-password") ||
                       path.startsWith("/auth");

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!isPublicRoute && (!user || (requireAdmin && !user.isAdmin))) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}