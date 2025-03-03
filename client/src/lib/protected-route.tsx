import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: () => React.JSX.Element;
  requireAdmin?: boolean;
};

export function ProtectedRoute({ path, component: Component, requireAdmin }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Check if this is a public route that doesn't require auth
  const isPublicRoute = 
    path === "/auth" ||
    path === "/verify" ||
    path === "/reset-password" ||
    path === "/forgot-password";

  // React to auth state changes
  React.useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      setLocation("/auth");
    }
  }, [user, isLoading, isPublicRoute, setLocation]);

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
    return <Route path={path} component={Component} />;
  }

  // Allow access to public routes without auth
  if (isPublicRoute) {
    // If user is logged in and trying to access auth pages, redirect to home
    if (user) {
      return (
        <Route path={path}>
          <Redirect to="/" />
        </Route>
      );
    }
    return <Route path={path} component={Component} />;
  }

  // Require auth for protected routes
  if (!user || (requireAdmin && !user.isAdmin)) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}