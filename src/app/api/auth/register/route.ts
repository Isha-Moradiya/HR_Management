import { NextRequest } from "next/server";
import { registerUser } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { signupSchema } from "../../lib/validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = signupSchema.parse(body);

    // Register the user
    const result = await registerUser(data);
    return response.success(result, "Registration successful");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
