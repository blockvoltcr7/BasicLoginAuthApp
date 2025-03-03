import React, { useEffect } from "react";
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

  // List of public routes that don't require authentication
  const isPublicRoute = 
    path === "/auth" ||
    path === "/verify" ||
    path === "/reset-password" ||
    path === "/forgot-password";

  // Handle navigation and auth state changes
  useEffect(() => {
    // Force check auth status when route changes
    if (!isLoading && !user && !isPublicRoute) {
      setLocation("/auth");
    }
  }, [user, isLoading, isPublicRoute, setLocation, location]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (!user && !isPublicRoute) {
        setLocation("/auth");
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, isPublicRoute, setLocation]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // Handle password reset flow separately
  if (path === "/reset-password") {
    return <Route path={path} component={Component} />;
  }

  // Handle public routes
  if (isPublicRoute) {
    // Redirect logged-in users away from auth pages
    if (user) {
      return (
        <Route path={path}>
          <Redirect to="/" />
        </Route>
      );
    }
    return <Route path={path} component={Component} />;
  }

  // Protect private routes
  if (!user || (requireAdmin && !user.isAdmin)) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}