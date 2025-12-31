"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { encryptData, decryptData } from "@/lib/crypto"; // Adjust the import path as necessary

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "employee";
  department?: string;
  avatar?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setUserAndToken: (user: User, token: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  getEmail: () => Promise<string | null>;
  setOtp: (otp: string) => Promise<void>;
  getOtp: () => Promise<string | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user and token from localStorage (decrypt)
    const restore = async () => {
      const storedUser = localStorage.getItem("hr_user");
      const storedToken = localStorage.getItem("hr_token");
      if (storedUser) {
        try {
          const decryptedUser = await decryptData(storedUser);
          setUser(JSON.parse(decryptedUser));
        } catch {
          localStorage.removeItem("hr_user");
        }
      }
      if (storedToken) {
        try {
          const decryptedToken = await decryptData(storedToken);
          setToken(decryptedToken);
        } catch {
          localStorage.removeItem("hr_token");
        }
      }
      setIsLoading(false);
    };
    restore();
  }, []);

  const setUserAndToken = async (user: User, token: string) => {
    setUser(user);
    setToken(token);
    const encryptedUser = await encryptData(JSON.stringify(user));
    const encryptedToken = await encryptData(token);
    const encryptedRole = await encryptData(user.role);
    const encryptedEmail = await encryptData(user.email);
    localStorage.setItem("hr_user", encryptedUser);
    localStorage.setItem("hr_token", encryptedToken);
    localStorage.setItem("hr_role", encryptedRole);
    localStorage.setItem("hr_email", encryptedEmail);
  };

  const setEmail = async (email: string) => {
    const encryptedEmail = await encryptData(email);
    localStorage.setItem("hr_email", encryptedEmail);
  };

  const getEmail = async () => {
    const stored = localStorage.getItem("hr_email");
    if (!stored) return null;
    try {
      return await decryptData(stored);
    } catch {
      localStorage.removeItem("hr_email");
      return null;
    }
  };

  const setOtp = async (otp: string) => {
    const encryptedOtp = await encryptData(otp);
    localStorage.setItem("hr_otp", encryptedOtp);
  };

  const getOtp = async () => {
    const stored = localStorage.getItem("hr_otp");
    if (!stored) return null;
    try {
      return await decryptData(stored);
    } catch {
      localStorage.removeItem("hr_otp");
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("hr_user");
    localStorage.removeItem("hr_token");
    localStorage.removeItem("hr_role");
    localStorage.removeItem("hr_email");
    localStorage.removeItem("hr_otp");
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    setUser,
    token,
    setUserAndToken,
    setEmail,
    getEmail,
    setOtp,
    getOtp,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
