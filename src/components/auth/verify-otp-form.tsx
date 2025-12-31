"use client";

import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { validateOtp } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

export function VerifyOtpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { toast } = useToast();
  const { getEmail, setUserAndToken, setOtp } = useAuth();
  const [type, setType] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtpState] = useState("      ");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Get type from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    setType(urlParams.get("type") || "");
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const otpDigits = otp.padEnd(6, " ").split("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleOtpDigitChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const otpArr = otp.split("");
    otpArr[idx] = value || " ";
    setOtpState(otpArr.join(""));

    // move focus to next input
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }

    const joined = otpArr.join("").replace(/\s/g, "");
    const validation = validateOtp(joined);
    setError(validation.message);
    setIsValid(validation.isValid);
  };

  const handleOtpDigitKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const otpArr = otp.split("");

      if (otpArr[idx] !== " ") {
        otpArr[idx] = " ";
        setOtpState(otpArr.join(""));
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        otpArr[idx - 1] = " ";
        setOtpState(otpArr.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length > 0) {
      const otpArr = "      ".split(""); // 6 blanks
      for (let i = 0; i < pasted.length; i++) {
        otpArr[i] = pasted[i];
      }
      setOtpState(otpArr.join(""));
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateOtp(otp);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      const email = await getEmail();
      if (!email) {
        setError("Email not found. Please try again.");
        setIsLoading(false);
        return;
      }

      const otpCode = otp.replace(/\s/g, "");

      // Call verify OTP API
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otpCode,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      // Handle OTP verification
      if (type === "registration" && data.data?.user && data.data?.token) {
        await setUserAndToken(data.data.user, data.data.token);
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully.",
          variant: "default",
        });

        // After registration verification, redirect to dashboard or login
        router.push("/dashboard"); // or "/login?verified=true" if you want them to login first
      } else if (type === "password-reset") {
        // Store the OTP for password reset
        await setOtp(otpCode);
        toast({
          title: "Identity verified",
          description:
            "Your identity has been verified. You can now reset your password.",
          variant: "default",
        });

        // After password reset verification, redirect to reset password
        router.push("/reset-password");
      }
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      setError(error.message || "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const email = await getEmail();
      if (!email) {
        setError("Email not found. Please try again.");
        setIsResending(false);
        return;
      }

      // Call resend OTP API
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        toast({
          title: "Code resent",
          description: "A new verification code has been sent to your email.",
          variant: "default",
        });
      }

      // Resend OTP logic here
      setCountdown(30); // Start 60 second countdown
      setOtpState("");
      setError("");
      setIsValid(false);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast({
        title: "Failed to resend code",
        description:
          "There was a problem sending a new verification code. Please try again.",
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

  const getInputClassName = () => {
    if (otp.length === 0) return "text-center text-lg tracking-widest";
    return `text-center text-lg tracking-widest ${
      isValid
        ? "border-green-500 focus:border-green-500"
        : error
        ? "border-red-500 focus:border-red-500"
        : ""
    }`;
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {getDescription()}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="otp" className="mb-1">
            Verification code
          </Label>
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
                onPaste={handlePaste}
                className={getInputClassName()}
                disabled={isLoading}
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isLoading}
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
