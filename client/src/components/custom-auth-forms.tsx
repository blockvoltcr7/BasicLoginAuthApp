
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { CustomInput } from "@/components/ui/custom-input";
import { CustomLabel } from "@/components/ui/custom-label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PasswordStrength } from "./password-strength";

// Schema definitions
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export function CustomLoginForm() {
  const { loginMutation } = useAuth();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <form 
      onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <CustomLabel htmlFor="username">Username</CustomLabel>
        <CustomInput 
          id="username"
          {...form.register("username")}
          autoComplete="username"
          placeholder="Enter your username" 
        />
        {form.formState.errors.username && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.username.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <CustomLabel htmlFor="password">Password</CustomLabel>
        <CustomInput 
          id="password"
          type="password" 
          {...form.register("password")}
          autoComplete="current-password"
          placeholder="Enter your password" 
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <a href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
          Forgot Password?
        </a>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

export function CustomRegisterForm() {
  const { registerMutation } = useAuth();
  const [password, setPassword] = useState("");
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <form 
      onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <CustomLabel htmlFor="reg-username">Username</CustomLabel>
        <CustomInput 
          id="reg-username"
          {...form.register("username")}
          placeholder="Choose a username" 
        />
        {form.formState.errors.username && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.username.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <CustomLabel htmlFor="email">Email</CustomLabel>
        <CustomInput 
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="your@email.com" 
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <CustomLabel htmlFor="reg-password">Password</CustomLabel>
        <CustomInput 
          id="reg-password"
          type="password"
          {...form.register("password")}
          onChange={(e) => {
            form.register("password").onChange(e);
            setPassword(e.target.value);
          }}
          placeholder="Create a strong password" 
        />
        <PasswordStrength password={password} />
        {form.formState.errors.password && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
