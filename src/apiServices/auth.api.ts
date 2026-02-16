import { api } from "@/lib/api-client";

export type UserRole = "admin" | "employee" | "hr";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyId: string;
    isVerified: boolean;
}

/* ================= REGISTER ================= */
export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    userId: string;
    companyId: string;
}

export const register = async (
    payload: RegisterPayload
): Promise<RegisterResponse> => {
    const { data } = await api.post("/auth/register", payload);
    return data;
};

/* ================= LOGIN ================= */
export interface LoginResponse {
    token: string;
    user: User;
    onboardingCompleted: boolean;
}

export const login = async (
    email: string,
    password: string,
): Promise<LoginResponse> => {
    const { data } = await api.post("/auth/login", { email, password });
    return data.data;
};

/* ================= VERIFY OTP ================= */
export interface VerifyOtpPayload {
    email: string;
    otpCode: string;
}

export interface VerifyOtpResponse {
    token: string;
    user: User;
    onboardingCompleted: boolean;
}

export const verifyOtp = async (
    payload: VerifyOtpPayload
): Promise<VerifyOtpResponse> => {
    const { data } = await api.post("/auth/verify-otp", payload);
    return data;
};

/* ================= RESEND OTP ================= */
export const resendOtp = async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post("/auth/resend-otp", { email });
    return data;
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (email: string): Promise<boolean> => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
};

/* ================= RESET PASSWORD ================= */
export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export const resetPassword = async (
    payload: ResetPasswordPayload
): Promise<boolean> => {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
};
