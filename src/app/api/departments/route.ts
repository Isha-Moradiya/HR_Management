import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../middleware/authMiddleware";
import * as fs from "fs";
import {
  createDepartment,
  getAllDepartments,
} from "../services/department.service";

// Get All Departments
export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin", "employee"]);
    const departments = await getAllDepartments();
    return NextResponse.json(departments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// Create Department
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const department_name = formData.get("department_name")?.toString() || "";
  const status =
    (formData.get("status")?.toString() as "active" | "inactive") || "active";

  const file = formData.get("logo") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}-${file.name}`;
  const filePath = `public/uploads/${filename}`;

  fs.writeFileSync(filePath, buffer);

  const department = await createDepartment({
    department_name,
    status,
    logo: `/uploads/${filename}`,
  });

  return NextResponse.json(department);
}
