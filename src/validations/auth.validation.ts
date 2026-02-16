import { z } from "zod";
import { ROLES } from "../app/api/lib/constants/enums";

export const signupSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Password must contain at least 1 number")
        .regex(/[@$!%*?&]/, "Password must contain at least 1 special character"),
});

export const verifyOtpSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    otpCode: z.string().length(6),
});

export const resendOtpSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Password must contain at least 1 number")
        .regex(/[@$!%*?&]/, "Password must contain at least 1 special character"),
});

export const inviteUserSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    role: z.enum(Object.values(ROLES) as [string, ...string[]]),
    departmentId: z.string().optional(),
    companyId: z.string().optional(),
});

export const acceptInviteSchema = z.object({
    token: z.string(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Password must contain at least 1 number")
        .regex(/[@$!%*?&]/, "Password must contain at least 1 special character"),
    firstName: z.string(),
    lastName: z.string(),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
    .object({
        token: z.string(),

        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters long")
            .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
            .regex(/[0-9]/, "Password must contain at least 1 number")
            .regex(/[@$!%*?&]/, "Password must contain at least 1 special character"),

        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });
