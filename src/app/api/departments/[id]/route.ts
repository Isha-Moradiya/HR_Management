import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  deleteDepartment,
  getDepartmentById,
  updateDepartment,
} from "../../services/department.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    authMiddleware(req, ["admin", "employee"]);
    const department = await getDepartmentById(params.id);
    if (!department)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(department);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    authMiddleware(req, ["admin"]);
    const data = await req.json();
    const department = await updateDepartment(params.id, data);
    if (!department)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(department);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    authMiddleware(req, ["admin"]);
    const department = await deleteDepartment(params.id);
    if (!department)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
