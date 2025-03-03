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
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

type LoginFormData = z.infer<typeof loginSchema>;
type MagicLinkFormData = z.infer<typeof magicLinkSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

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
          onSubmit={magicLinkForm.handleSubmit((data) =>
            magicLinkMutation.mutate(data)
          )}
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
              <p className="text-red-500 text-xs mt-1">
                {magicLinkForm.formState.errors.email.message}
              </p>
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
          onSubmit={passwordForm.handleSubmit((data) =>
            loginMutation.mutate(data)
          )}
          className="space-y-4"
        >
          <div className="space-y-2">
            <CustomLabel htmlFor="username">Username</CustomLabel>
            <PlaceholdersAndVanishInput
              placeholders={["Enter your username", "Your username here"]}
              onChange={(e) => passwordForm.setValue("username", e.target.value)}
              value={passwordForm.watch("username")}
              showButton={false}
              submitOnEnter={false}
              className="bg-black border-white/10 focus:border-white/20 h-10 overflow-visible"
              inputClassName="pl-4 pr-4"
            />
            {passwordForm.formState.errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {passwordForm.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <CustomLabel htmlFor="password">Password</CustomLabel>
              <a
                className="text-xs text-gray-500 hover:text-white transition-colors"
                href="/forgot-password"
              >
                Forgot?
              </a>
            </div>
            <CustomInput
              id="password"
              type="password"
              {...passwordForm.register("password")}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="bg-black border-white/10 focus:border-white/20"
            />
            {passwordForm.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {passwordForm.formState.errors.password.message}
              </p>
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
  const [passwordScore, setPasswordScore] = useState(0);

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
        <p className="text-gray-500">
          Enter your information to create an account
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
        className="space-y-4"
      >
        <div className="space-y-2">
          <CustomLabel htmlFor="register-username">Username</CustomLabel>
          <PlaceholdersAndVanishInput
            placeholders={["Choose a username", "Enter your preferred username"]}
            onChange={(e) => form.setValue("username", e.target.value)}
            value={form.watch("username")}
            showButton={false}
            submitOnEnter={false}
            className="bg-black border-white/10 focus:border-white/20 h-10 overflow-visible"
            inputClassName="pl-4 pr-4"
          />
          {form.formState.errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <CustomLabel htmlFor="register-email">Email</CustomLabel>
          <PlaceholdersAndVanishInput
            placeholders={["your@email.com", "Enter your email address"]}
            onChange={(e) => form.setValue("email", e.target.value)}
            value={form.watch("email")}
            showButton={false}
            submitOnEnter={false}
            className="bg-black border-white/10 focus:border-white/20 h-10 overflow-visible"
            inputClassName="pl-4 pr-4"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <CustomLabel htmlFor="password">Password</CustomLabel>
          <CustomInput
            id="password"
            type="password"
            {...form.register("password")}
            onChange={(e) => {
              form.setValue("password", e.target.value);
              setPassword(e.target.value);
            }}
            placeholder="Create a strong password"
            className="bg-black border-white/10 focus:border-white/20"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
          <PasswordStrength password={password} onScoreChange={setPasswordScore} />
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