
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Premium Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-zinc-100">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome, {user?.username}!
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400">
                You are logged in as a {user?.isAdmin ? "admin" : "user"}.
              </p>
            </CardContent>
          </Card>

          {user?.isAdmin && (
            <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-zinc-100">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  This section is only visible to administrators.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
