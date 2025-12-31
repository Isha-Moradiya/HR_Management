"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { validateForgotPasswordForm } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { toast } = useToast();
  const { setEmail } = useAuth();
  const [email, setEmailState] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailState(e.target.value);

    if (touched.email) {
      const newErrors = validateForgotPasswordForm(e.target.value);
      setErrors(newErrors);
    }
  };

  const handleBlur = () => {
    setTouched({ email: true });
    const newErrors = validateForgotPasswordForm(email);
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const newErrors = validateForgotPasswordForm(email);
    setErrors(newErrors);
    setTouched({ email: true });

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok || data.success) {
        toast({
          title: "Verification code sent",
          description: "Please check your email for the verification code.",
          variant: "default",
        });

        await setEmail(email);
        router.push("/verify-otp?type=password-reset");
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast({
        title: "Failed to send verification code",
        description:
          "There was a problem sending the verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = () => {
    if (!touched.email) return "";
    return errors.email
      ? "border-red-500 focus:border-red-500"
      : "border-green-500 focus:border-green-500";
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              disabled={isLoading}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              className={getInputClassName()}
            />
            {touched.email && !errors.email && !isLoading && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            "Send verification code"
          )}
        </Button>
      </div>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <a
          href="/login"
          className={`underline underline-offset-4 ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Back to login
        </a>
      </div>
    </form>
  );
}
