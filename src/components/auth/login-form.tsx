"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { login } from "@/apiServices/auth.api";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema } from "@/validations/auth.validation";
import { toast } from "sonner";

export type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { setUserAndToken, setEmail } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("verified") === "true") {
      toast.success("Email verified");
    }

    if (params.get("reset") === "true") {
      toast.success("Password reset successful");
    }
  }, [toast]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await login(values.email, values.password);
      
      await setUserAndToken(data.user, data.token);
      await setEmail(data.user.email);

      // Redirect based on onboarding status
      if (data.onboardingCompleted) {
        // Redirect based on user role
        if (data.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/employee");
        }
      } else {
        router.push("/company-onboarding");
      }

      toast.success("Login successful");
    } catch (err: any) {
      toast.error("Login Failed")
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md"
        noValidate
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials below
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline underline-offset-4"
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <Button type="button" variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.32 1.53 7.77 2.81l5.68-5.68C33.93 3.5 29.45 1.5 24 1.5 14.73 1.5 6.73 6.84 3.01 14.57l6.63 5.15C11.4 13.53 17.2 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.07-.4-4.5H24v9h12.7c-.55 2.96-2.18 5.47-4.62 7.18l7.08 5.5c4.14-3.82 6.34-9.45 6.34-17.18z" />
              <path fill="#FBBC05" d="M9.64 28.72c-.45-1.35-.7-2.79-.7-4.22s.25-2.87.7-4.22l-6.63-5.15C1.07 18.28 0 21.07 0 24.5s1.07 6.22 3.01 9.37l6.63-5.15z" />
              <path fill="#34A853" d="M24 47.5c5.45 0 9.93-1.8 13.24-4.89l-7.08-5.5c-1.96 1.32-4.49 2.09-6.16 2.09-6.8 0-12.6-4.03-14.36-9.78l-6.63 5.15C6.73 41.16 14.73 47.5 24 47.5z" />
            </svg>
            Login with Google
          </Button>
        </div>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
    </Form>
  );
}
