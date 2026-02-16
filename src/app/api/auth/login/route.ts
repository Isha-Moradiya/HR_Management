import { NextRequest } from "next/server";
import { loginUser } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { loginSchema } from "../../../../validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = loginSchema.parse(body);

    const result = await loginUser(data.email, data.password);
    return response.success(result, "Login successful");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}

