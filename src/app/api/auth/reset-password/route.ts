import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { validateResetPasswordForm } from "@/lib/validation";
import { resetPasswordSchema } from "../../lib/validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = resetPasswordSchema.parse(body);

    const result = await resetPassword(data);
    return response.success(result, "Password reset successfully");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
