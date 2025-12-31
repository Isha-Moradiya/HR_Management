import Otp from "../models/otp";
import User from "../models/user";
import Company from "../models/company";
import bcrypt from "bcryptjs";
import { sendOtpToEmail, sendResetPasswordLink } from "@/app/api/utils/emailSend";
import { generateOtp, generateOtpExpiry, generateResetToken, generateToken } from "../utils/utils";
import { ROLES, USER_STATUS } from "../lib/constants/enums";
import crypto from "crypto"

interface RegisterUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: "admin" | "employee" | "hr";
}

// Register
export const registerUser = async (data: RegisterUserProps) => {

  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("User already exists");
  }

  // Create company (empty onboarding)
  const company = await Company.create({
    onboardingCompleted: false,
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: hashedPassword,
    role: ROLES.ADMIN,
    companyId: company._id,
    status: USER_STATUS.PENDING_VERIFICATION,
    emailVerified: false,
  });

  const otpCode = generateOtp();

  await Otp.create({
    email: user.email,
    otpCode,
    expiresAt: generateOtpExpiry(300),
  });

  const username = `${user.firstName}${user.lastName}`

  await sendOtpToEmail(user.email, otpCode, username);

  console.log("✅ User registration completed successfully");
  return {
    userId: user._id,
    companyId: company._id,
  };
};

// Login
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new Error("User is not active");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  if (!user.emailVerified) {
    throw new Error("Please verify your email first");
  }

  const token = generateToken(user._id.toString(), user.email, user.companyId.toString(), user.role);

  return {
    token,
    user: {
      id: user._id,
      role: user.role,
      companyId: user.companyId,
    },
  };
};

// Verify OTP
export const verifyOtp = async ({
  email,
  otpCode,
}: {
  email: string;
  otpCode: string;
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otpRecord = await Otp.findOne({ email, otpCode });
  if (!otpRecord) {
    throw new Error("Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  if (user.emailVerified) {
    throw new Error("User already verified");
  }

  user.emailVerified = true;
  user.status = USER_STATUS.ACTIVE;
  await user.save();

  await Otp.deleteMany({ email });

  // Fetch company (for onboarding check)
  const company = await Company.findById(user.companyId);

  const token = generateToken(user._id.toString(), user.companyId.toString(), user.email, user.role);

  return {
    token,
    role: user.role,
    onboardingCompleted: company?.onboardingCompleted ?? false,
  };
};

// Resend OTP
export const resendOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

  const existingOtp = await Otp.findOne({ email });

  if (existingOtp && existingOtp.expiresAt > new Date()) {
    const now = new Date();
    const secondsSinceLastOtp =
      (now.getTime() - existingOtp.createdAt.getTime()) / 1000;

    if (secondsSinceLastOtp < 30) {
      throw new Error("Please wait 30 seconds before requesting again");
    }
  }

  await Otp.deleteMany({ email });

  const otpCode = generateOtp();

  await Otp.create({
    email,
    otpCode,
    expiresAt: generateOtpExpiry(30),
  });

  const username = `${user.firstName}${user.lastName}`

  await sendOtpToEmail(email, otpCode, username);

  return {
    message: "OTP resent successfully",
  };
};

// Forgot Password
export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email, emailVerified: true, status: USER_STATUS.ACTIVE });

  if (!user) {
    throw new Error("User not found or not verified");
  }

  const { rawToken, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  const username = `${user.firstName}${user.lastName}`

  await sendResetPasswordLink(email, resetLink, username);
  return true;
};

// Reset Password
export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = "";
  await user.save();

  return true;
};
