import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { LoginForm, RegisterForm } from "@/components/auth-forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function AuthPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>
        
        <Card className="w-full bg-black border-zinc-800 backdrop-blur-sm shadow-xl">
          <div className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-800">
                <TabsTrigger value="login" className="data-[state=active]:bg-zinc-700">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-zinc-700">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
