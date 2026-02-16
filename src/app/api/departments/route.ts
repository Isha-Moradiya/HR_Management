import { NextRequest } from "next/server";
import { connectDB } from "@/app/api/config/database";
import { response } from "@/app/api/lib/response/responseHandler";
import { authMiddleware } from "@/app/api/middleware/authMiddleware";
import {
  createDepartment,
  getAllDepartments,
} from "@/app/api/services/department.service";

export const config = { api: { bodyParser: false } };

// Get All Departments
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { user } = authMiddleware(req, ["admin", "employee"]);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const result = await getAllDepartments({
      companyId: user.companyId,
      page,
      limit,
    });

    return response.success(result, "Departments fetched");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}

// Create Department
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { user } = authMiddleware(req, ["admin"]);

    const formData = await req.formData();
    const payload: any = Object.fromEntries(formData.entries());

    const logo = formData.get("logo") as File | null;
    if (logo && typeof logo !== "string") {
      payload.logo = logo.name;
    }

    const department = await createDepartment({
      companyId: user.companyId,
      department_name: payload.department_name,
      status: payload.status,
      logo: payload.logo,
    });

    return response.success(department, "Department created successfully");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
