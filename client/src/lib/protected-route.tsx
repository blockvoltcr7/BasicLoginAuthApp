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

  // Check if this is a public route that doesn't require auth
  const isPublicRoute = 
    path === "/auth" ||
    path === "/verify" ||
    path === "/reset-password" ||
    path === "/forgot-password";

  console.log("[ProtectedRoute]", {
    path,
    isPublicRoute,
    isLoading,
    hasUser: !!user,
    currentUrl: window.location.href
  });

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // Handle reset password flow separately
  if (path === "/reset-password") {
    console.log("[ProtectedRoute] Allowing access to reset password page");
    return <Route path={path} component={Component} />;
  }

  // Allow access to public routes without auth
  if (isPublicRoute) {
    console.log("[ProtectedRoute] Allowing access to public route:", path);
    return <Route path={path} component={Component} />;
  }

  // Require auth for protected routes
  if (!user || (requireAdmin && !user.isAdmin)) {
    console.log("[ProtectedRoute] Redirecting to auth due to missing permissions");
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  console.log("[ProtectedRoute] Rendering protected component for path:", path);
  return <Route path={path} component={Component} />;
}