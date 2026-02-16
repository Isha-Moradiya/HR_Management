"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cn } from "@/lib/utils";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { verifyOtp, resendOtp, VerifyOtpPayload } from "@/apiServices/auth.api";

// Define the form schema
const verifyOtpSchema = z.object({
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export function VerifyOtpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { getEmail, setUserAndToken, setOtp, user } = useAuth();

  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const type = searchParams.get("type") || "";
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Watch OTP value to validate
  const otpValue = form.watch("otp");

  // Handle OTP digit change
  const handleOtpDigitChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const currentOtp = otpValue.padEnd(6, " ").split("");
    currentOtp[idx] = value || " ";
    const newOtp = currentOtp.join("").replace(/\s/g, "");

    form.setValue("otp", newOtp, { shouldValidate: true });

    // Move focus to next input if value entered
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpDigitKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const currentOtp = otpValue.padEnd(6, " ").split("");

      if (currentOtp[idx] !== " ") {
        currentOtp[idx] = " ";
        const newOtp = currentOtp.join("").replace(/\s/g, "");
        form.setValue("otp", newOtp, { shouldValidate: true });
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        currentOtp[idx - 1] = " ";
        const newOtp = currentOtp.join("").replace(/\s/g, "");
        form.setValue("otp", newOtp, { shouldValidate: true });
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      e.preventDefault();
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length > 0) {
      form.setValue("otp", pasted, { shouldValidate: true });
      // Focus the next input after the pasted content
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const onSubmit = async (values: VerifyOtpFormValues) => {
    setIsLoading(true);

    try {
      const email = await getEmail();
      if (!email) {
        throw new Error("Email not found. Please try again.");
      }

      const payload: VerifyOtpPayload = {
        email: email,
        otpCode: values.otp,
      };

      // Call verify OTP API
      const response = await verifyOtp(payload);

      // Handle OTP verification
      if (type === "registration") {
        // Create a complete user object
        const completeUser = {
          ...response.user,
          email: email,
          firstName: "",
          lastName: "",
          isVerified: true,
        };

        await setUserAndToken(completeUser, response.token);
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully.",
          variant: "default",
        });

        // Redirect based on onboarding status
        if (response.onboardingCompleted) {
          // Redirect based on user role
          if (user?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/employee");
          }
        } else {
          router.push("/company-onboarding");
        }
      } else if (type === "password-reset") {
        // Store the OTP for password reset
        await setOtp(values.otp);
        toast({
          title: "Identity verified",
          description: "Your identity has been verified. You can now reset your password.",
          variant: "default",
        });
        router.push("/reset-password");
      }
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      toast({
        title: "Verification failed",
        description: err?.response?.data?.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });

      // Set form error
      form.setError("otp", {
        type: "manual",
        message: err?.response?.data?.message || "Invalid verification code",
      });

      // Clear OTP on error
      form.setValue("otp", "", { shouldValidate: true });
      inputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const email = await getEmail();
      if (!email) {
        throw new Error("Email not found. Please try again.");
      }

      // Call resend OTP API
      await resendOtp(email);

      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
        variant: "default",
      });

      // Reset form and start countdown
      form.reset({ otp: "" });
      setCountdown(60); // 60 second countdown
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      console.error("Failed to resend OTP:", err);
      toast({
        title: "Failed to resend code",
        description: err?.response?.data?.message || "There was a problem sending a new verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const getTitle = () => {
    return type === "registration"
      ? "Verify your email"
      : "Verify your identity";
  };

  const getDescription = () => {
    return type === "registration"
      ? "We sent a verification code to your email address. Enter it below to verify your account."
      : "We sent a verification code to your email address. Enter it below to reset your password.";
  };

  // Get OTP digits for display
  const otpDigits = otpValue.padEnd(6, " ").split("");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {getDescription()}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <div className="relative flex justify-center gap-2">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <Input
                          key={idx}
                          ref={(el) => {
                            inputsRef.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          value={otpDigits[idx] === " " ? "" : otpDigits[idx]}
                          onChange={(e) => handleOtpDigitChange(idx, e)}
                          onKeyDown={(e) => handleOtpDigitKeyDown(idx, e)}
                          onPaste={idx === 0 ? handlePaste : undefined}
                          className={cn(
                            "h-14 w-14 text-center text-2xl font-bold tracking-widest",
                            form.formState.errors.otp && "border-destructive"
                          )}
                          disabled={isLoading}
                          aria-label={`Digit ${idx + 1} of verification code`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  {form.formState.errors.otp ? (
                    <div className="flex items-center gap-1 text-sm text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {form.formState.errors.otp.message}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Enter the 6-digit code sent to your email
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : type === "registration" ? (
                "Verify Email"
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isResending || isLoading}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    "Resend code"
                  )}
                </Button>
              </p>
            </div>
          </div>

          <div className="text-center text-sm">
            <a
              href="/login"
              className={`underline underline-offset-4 ${isLoading ? "pointer-events-none opacity-50" : ""
                }`}
            >
              Back to login
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}