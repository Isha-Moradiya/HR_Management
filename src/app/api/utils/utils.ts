import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate a 6-digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create expiry timestamp for OTP (default: 5 minutes)
export const generateOtpExpiry = (seconds: number = 300) => {
  return new Date(Date.now() + seconds * 1000);
};

// Generate JWT token
export const generateToken = (
  userId: string,
  email: string,
  companyId: string,
  role: string
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment");
  }

  const payload = {
    userId,
    email,
    role,
    companyId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};