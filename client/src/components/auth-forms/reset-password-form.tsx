import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface Props {
  token: string;
}

export function ResetPasswordForm({ token }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
    },
  });

  async function onSubmit(data: { token: string; password: string }) {
    setIsLoading(true);
    try {
      console.log("[ResetPasswordForm] Submitting password reset");
      const res = await apiRequest("POST", "/api/reset-password", data);
      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to reset password");
      }

      console.log("[ResetPasswordForm] Password reset successful");
      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });

      // Navigate to home page after successful password reset
      window.location.href = "/";
    } catch (error) {
      console.error("[ResetPasswordForm] Password reset error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </Form>
  );
}