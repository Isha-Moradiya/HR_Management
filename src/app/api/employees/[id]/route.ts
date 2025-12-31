import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { deleteEmployee, getEmployeeById, updateEmployee } from "../../services/employee.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    authMiddleware(req, ["admin", "employee"]);
    const employee = await getEmployeeById(params.id);
    if (!employee)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(employee);
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
    const employee = await updateEmployee(params.id, data);
    if (!employee)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(employee);
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
    const employee = await deleteEmployee(params.id);
    if (!employee)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
