"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { validateResetPasswordForm, validatePassword } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { toast } = useToast();
  const { getEmail, getOtp } = useAuth();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = validateResetPasswordForm({
        ...formData,
        [name]: value,
      });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
    }

    // Special case for password confirmation
    if (name === "password" && touched.confirmPassword) {
      const newErrors = validateResetPasswordForm({
        ...formData,
        password: value,
      });
      setErrors((prev) => ({
        ...prev,
        confirmPassword: newErrors.confirmPassword || "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const newErrors = validateResetPasswordForm(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateResetPasswordForm(formData);
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
      const email = await getEmail();
      const otpCode = await getOtp();

      if (!email) {
        toast({
          title: "Email not found",
          description: "Please restart the password reset process.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!otpCode) {
        toast({
          title: "Verification required",
          description: "Please verify your email first.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Call reset password API
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: formData.password,
          otpCode,
        }),
      });
      const data = await res.json();

      if (res.ok || data.success) {
        toast({
          title: "Password reset successful",
          description:
            "Your password has been updated. You can now log in with your new password.",
          variant: "default",
        });
        router.push("/login?reset=true");
      }
    } catch (error: any) {
      console.error("Password reset failed:", error);
      toast({
        title: "Password reset failed",
        description:
          error.message ||
          "There was a problem resetting your password. Please try again.",
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

  const passwordValidationResult = validatePassword(formData.password);

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your new password below to complete the reset process.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`pr-10 ${getInputClassName("password")}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            {touched.password && !errors.password && !isLoading && (
              <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {touched.password && errors.password && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password}
            </p>
          )}
          {formData.password && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Password requirements:
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div
                  className={`flex items-center gap-1 ${
                    passwordValidationResult.requirements.minLength
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordValidationResult.requirements.minLength ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  8+ characters
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordValidationResult.requirements.hasUpperCase
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordValidationResult.requirements.hasUpperCase ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  Uppercase letter
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordValidationResult.requirements.hasLowerCase
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordValidationResult.requirements.hasLowerCase ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  Lowercase letter
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordValidationResult.requirements.hasNumbers
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordValidationResult.requirements.hasNumbers ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  Number
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              disabled={isLoading}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`pr-10 ${getInputClassName("confirmPassword")}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            {touched.confirmPassword &&
              !errors.confirmPassword &&
              !isLoading && (
                <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </div>
      <div className="text-center text-sm">
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
