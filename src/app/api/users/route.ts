import { NextRequest } from "next/server";
import { connectDB } from "@/app/api/config/database";
import { response } from "../lib/response/responseHandler";
import { getAllUsers } from "@/app/api/services/users.service";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const role = searchParams.get("role") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    if (!companyId) return response.badRequest("companyId is required");

    const users = await getAllUsers({ companyId, role, page, limit });
    return response.success(users, "Users fetched successfully");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
