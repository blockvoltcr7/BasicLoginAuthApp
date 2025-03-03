import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { CustomInput } from "@/components/ui/custom-input";
import { CustomLabel } from "@/components/ui/custom-label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PasswordStrength } from "./ui/password-strength";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

export function CustomLoginForm() {
  const [useMagicLink, setUseMagicLink] = useState(false);
  const { loginMutation, magicLinkMutation } = useAuth();

  const passwordForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 bg-black p-8 rounded-xl backdrop-blur-sm border border-white/5"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-500">
          {useMagicLink 
            ? "Enter your email to receive a magic link" 
            : "Enter your credentials to access your account"}
        </p>
      </div>

      {useMagicLink ? (
        <form 
          onSubmit={magicLinkForm.handleSubmit((data) => magicLinkMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <CustomLabel htmlFor="email">Email</CustomLabel>
            <CustomInput 
              id="email"
              type="email"
              {...magicLinkForm.register("email")}
              placeholder="your@email.com"
              className="bg-black border-white/10 focus:border-white/20"
            />
            {magicLinkForm.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{magicLinkForm.formState.errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-white/5 text-white border border-white/10 hover:border-white/20 transition-all duration-300"
            disabled={magicLinkMutation.isPending}
          >
            {magicLinkMutation.isPending ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <span className="mr-2">Sending magic link</span>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              "Send Magic Link"
            )}
          </Button>
        </form>
      ) : (
        <form 
          onSubmit={passwordForm.handleSubmit((data) => loginMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <CustomLabel htmlFor="username">Username</CustomLabel>
            <CustomInput 
              id="username"
              {...passwordForm.register("username")}
              autoComplete="username"
              placeholder="Enter your username"
              className="bg-black border-white/10 focus:border-white/20"
            />
            {passwordForm.formState.errors.username && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="password">Password</CustomLabel>
            <CustomInput 
              id="password"
              type="password" 
              {...passwordForm.register("password")}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="bg-black border-white/10 focus:border-white/20"
            />
            {passwordForm.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="/forgot-password" 
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Forgot Password?
            </motion.a>
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-white/5 text-white border border-white/10 hover:border-white/20 transition-all duration-300"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <span className="mr-2">Signing in</span>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-black hover:bg-white/5 text-white border border-white/10 hover:border-white/20 transition-all duration-300"
        onClick={() => setUseMagicLink(!useMagicLink)}
      >
        {useMagicLink ? "Use Password" : "Use Magic Link"}
      </Button>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 bg-black p-8 rounded-xl backdrop-blur-sm border border-white/5"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-gray-500">Enter your details to register a new account</p>
      </div>

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
            className="bg-black border-white/10 focus:border-white/20"
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
            className="bg-black border-white/10 focus:border-white/20"
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
            className="bg-black border-white/10 focus:border-white/20"
          />
          <PasswordStrength password={password} />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-black hover:bg-white/5 text-white border border-white/10 hover:border-white/20 transition-all duration-300"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <span className="mr-2">Creating account</span>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </motion.div>
  );
}