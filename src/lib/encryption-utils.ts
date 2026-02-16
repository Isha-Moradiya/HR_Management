import CryptoJS from "crypto-js";
import { clientEnv } from "../config/env.client";

const SECRET_KEY = clientEnv.SECRET_KEY || "fallback-secret-key";

export const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (encryptedText: string | null): string => {
  if (!encryptedText) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
