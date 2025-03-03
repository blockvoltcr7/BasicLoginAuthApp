import { CustomLoginForm, CustomRegisterForm } from "@/components/custom-auth-forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function LoginForm() {
  return <CustomLoginForm />;
}

export function RegisterForm() {
  return <CustomRegisterForm />;
}

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export function ForgotPasswordForm() {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    // TODO: Implement forgot password functionality
    console.log("Forgot password:", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 bg-black p-8 rounded-xl backdrop-blur-sm border border-white/5"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Reset Password
        </h1>
        <p className="text-gray-500">Enter your email to receive a password reset link</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    placeholder="your@email.com"
                    className="bg-black border-white/10 focus:border-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-black hover:bg-white/5 text-white border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            Send Reset Link
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

export function ResetPasswordForm() {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    // TODO: Implement reset password functionality
    console.log("Reset password:", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 bg-black p-8 rounded-xl backdrop-blur-sm border border-white/5"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Create New Password
        </h1>
        <p className="text-gray-500">Enter your new password below</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password" 
                    placeholder="Enter your new password"
                    className="bg-black border-white/10 focus:border-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password" 
                    placeholder="Confirm your new password"
                    className="bg-black border-white/10 focus:border-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-black hover:bg-white/5 text-white border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

export {};