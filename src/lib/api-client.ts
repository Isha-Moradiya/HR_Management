import axios from "axios";
import { clientEnv } from "../config/env.client";
import { encrypt, decrypt } from "./encryption-utils";

// Token management functions
const TOKEN_KEY = "hr_token";

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, encrypt(token));
};

export const getAuthToken = (): string | null => {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  if (!encrypted) return null;
  try {
    return decrypt(encrypted);
  } catch (error) {
    removeAuthToken();
    return null;
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Clear all authentication storage
export const clearAuthStorage = () => {
  removeAuthToken();
  localStorage.removeItem("hr_user");
  localStorage.removeItem("hr_email");
  localStorage.removeItem("hr_role");
};

// Create axios instance
export const api = axios.create({
  baseURL: clientEnv.API_URL,
});

// Request interceptor - attach token only if available
api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // Only handle 401 for non-public endpoints
    if (error.response?.status === 401) {
      const errorMessage = error.response.data?.message?.toLowerCase() || '';
      const errorStatus = error.response.data?.status?.toLowerCase() || '';
      const isInvalidToken = errorMessage.includes("invalid token") || errorStatus.includes('unauthorized');

      if (isInvalidToken) {
        clearAuthStorage();

        if (window.location.pathname !== '/') {
          setTimeout(() => {
            window.location.href = '/';
          }, 0);
        }
      }
    }

    return Promise.reject(error);
  }
);
