"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { validateLoginForm } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { toast } = useToast();
  const { setUserAndToken, setEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for success messages from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("verified") === "true") {
      toast({
        title: "Email verified",
        description:
          "Your email has been verified successfully. You can now log in.",
        variant: "default",
      });
    } else if (urlParams.get("reset") === "true") {
      toast({
        title: "Password reset successful",
        description:
          "Your password has been reset. You can now log in with your new password.",
        variant: "default",
      });
    }
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = validateLoginForm({
        ...formData,
        [name]: value,
      });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const newErrors = validateLoginForm(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const { email, password } = formData;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok || data.success) {
        // Store token and email securely
        if (data.data?.user && data.data?.token) {
          await setUserAndToken(data.data.user, data.data.token);
          await setEmail(data.data.user.email);
        }

        toast({
          title: "Login successful",
          description: "Welcome back!",
          variant: "default",
        });
        
        // If successful, redirect to dashboard
        router.push("/dashboard");
      } else {
        setErrors({ email: data.error || "Login failed", password: "" });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    if (!touched[fieldName]) return "";
    return errors[fieldName]
      ? "border-red-500 focus:border-red-500"
      : "border-green-500 focus:border-green-500";
  };

  // const handleDemoLogin = async (role: "admin" | "employee") => {
  //   const credentials = {
  //     admin: { email: "admin@hrpro.com", password: "password123" },
  //     employee: { email: "john.doe@company.com", password: "password123" },
  //   };

  //   setFormData(credentials[role]);

  //   const result = await login(
  //     credentials[role].email,
  //     credentials[role].password
  //   );
  //   if (result.success) {
  //     window.location.href = "/dashboard";
  //   }
  // };
  return (
    <div className="w-full max-w-md">
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                disabled={isLoading}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getInputClassName("email")}
              />
              {touched.email && !errors.email && !isLoading && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {touched.email && errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className={`ml-auto text-sm underline-offset-4 hover:underline ${
                  isLoading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Forgot your password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getInputClassName("password")}
              />
              {touched.password && !errors.password && !isLoading && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {touched.password && errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button> */}
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className={`underline underline-offset-4 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
