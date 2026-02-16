import { NextRequest } from "next/server";
import { connectDB } from "@/app/api/config/database";
import { response } from "@/app/api/lib/response/responseHandler";
import { authMiddleware } from "@/app/api/middleware/authMiddleware";
import {
  deleteDepartment,
  getDepartmentById,
  updateDepartment,
} from "@/app/api/services/department.service";

// Get Department by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    authMiddleware(req, ["admin", "employee"]);

    const department = await getDepartmentById(params.id);
    return response.success(department, "Department fetched");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}

// Update Department
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    authMiddleware(req, ["admin"]);

    const formData = await req.formData();
    const payload: any = Object.fromEntries(formData.entries());

    const logo = formData.get("logo") as File | null;
    if (logo && typeof logo !== "string") {
      payload.logo = logo.name;
    }

    const department = await updateDepartment(params.id, payload);
    return response.success(department, "Department updated");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}

// Delete Department
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    authMiddleware(req, ["admin"]);

    const result = await deleteDepartment(params.id);
    return response.success(result, "Department deleted");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
