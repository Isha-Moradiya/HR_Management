import { NextRequest } from "next/server";
import { connectDB } from "@/app/api/config/database";
import { response } from "../../lib/response/responseHandler";
import { getUserById, updateUser, deleteUser } from "@/app/api/services/users.service";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();

    if (!id) return response.badRequest("User id is required");

    const user = await getUserById(id);
    return response.success(user, "User fetched successfully");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();
    if (!id) return response.badRequest("User id is required");

    const data = await req.json();
    const updatedUser = await updateUser(id, data);
    return response.success(updatedUser, "User updated successfully");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();
    if (!id) return response.badRequest("User id is required");

    const result = await deleteUser(id);
    return response.success(result, "User deleted successfully");
  } catch (error: any) {
    return response.internalServerError(error.message);
  }
}
