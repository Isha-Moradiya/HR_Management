import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { verifyOtpSchema } from "../../lib/validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = verifyOtpSchema.parse(body);

    const result = await verifyOtp(data);
    return response.success(result, "OTP verification successful");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
