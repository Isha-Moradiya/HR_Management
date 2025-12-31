"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { validateRegistrationForm, validatePassword } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { toast } = useToast();
  const { setEmail } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = validateRegistrationForm({
        ...formData,
        [name]: value,
      });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
    }

    // Special case for password confirmation
    if (name === "password" && touched.confirmPassword) {
      const newErrors = validateRegistrationForm({
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

    const newErrors = validateRegistrationForm(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateRegistrationForm(formData);
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
      const { firstName, lastName, email, password, confirmPassword } = formData;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          role: "employee",
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Account created",
          description: "Please verify your email to continue.",
          variant: "default",
        });
        await setEmail(formData.email);
        router.push("/verify-otp?type=registration");
      } else {
        // Handle API errors
        const errorMessage = data.message || "Registration failed";
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Set specific field errors if provided
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was a problem creating your account. Please try again.",
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
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your information below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First name</Label>
            <div className="relative">
              <Input
                id="first-name"
                name="firstName"
                placeholder="Max"
                disabled={isLoading}
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getInputClassName("firstName")}
              />
              {touched.firstName && !errors.firstName && !isLoading && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {touched.firstName && errors.firstName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.firstName}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <div className="relative">
              <Input
                id="last-name"
                name="lastName"
                placeholder="Robinson"
                disabled={isLoading}
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getInputClassName("lastName")}
              />
              {touched.lastName && !errors.lastName && !isLoading && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {touched.lastName && errors.lastName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
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
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
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
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
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
          <Label htmlFor="confirm-password">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              disabled={isLoading}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={getInputClassName("confirmPassword")}
            />
            {touched.confirmPassword &&
              !errors.confirmPassword &&
              !isLoading && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
        {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
>>>>>>> Stashed changes
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
          Sign up with GitHub
        </Button> */}
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a
          href="/login"
          className={`underline underline-offset-4 ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Sign in
        </a>
      </div>
    </form>
  );
}
