import { CustomLoginForm, CustomRegisterForm } from "@/components/custom-auth-forms";

export function LoginForm() {
  return <CustomLoginForm />;
}

export function RegisterForm() {
  return <CustomRegisterForm />;
}

// Placeholder implementation for custom auth forms.  Replace with your actual components.
// This example uses Tailwind CSS for styling and assumes a dark theme is already applied.
//  You will need to adapt this based on your Aceternity UI component library.

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";


const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const CustomLoginForm = () => {
  const { loginMutation } = useAuth();
  const form = useForm({ resolver: zodResolver(loginSchema) });

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-gray-800 rounded-lg shadow-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <div>
                <label htmlFor="username" className="block text-white text-sm font-medium mb-1">Username</label>
                <FormControl>
                  <Input id="username" {...field} className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium mb-1">Password</label>
                <FormControl>
                  <Input type="password" id="password" {...field} className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Login
          </Button>
          </div>
      </form>
      </Form>
    </div>
  );
};


const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const CustomRegisterForm = () => {
  const { registerMutation } = useAuth();
  const form = useForm({ resolver: zodResolver(registerSchema) });

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-gray-800 rounded-lg shadow-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <div>
                <label htmlFor="username" className="block text-white text-sm font-medium mb-1">Username</label>
                <FormControl>
                  <Input id="username" {...field} className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-1">Email</label>
                <FormControl>
                  <Input type="email" id="email" {...field} className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium mb-1">Password</label>
                <FormControl>
                  <Input type="password" id="password" {...field} className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Register
          </Button>
          </div>
      </form>
      </Form>
    </div>
  );
};

export {}