import { NextRequest } from "next/server";
import { forgotPassword } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { forgotPasswordSchema } from "../../../../validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = forgotPasswordSchema.parse(body);

    const result = await forgotPassword(data.email);
    return response.success(result, "Sent link to your email for forgotPassword");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
