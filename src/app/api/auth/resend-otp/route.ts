import { NextRequest } from "next/server";
import { resendOtp } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { resendOtpSchema } from "../../../../validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = resendOtpSchema.parse(body);

    const result = await resendOtp(data.email);
    return response.success(result, "Resend OTP to your email");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
