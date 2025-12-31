import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getAttendanceById, updateAttendance } from "../../services/attendance.service";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    authMiddleware(req, ["admin"]);
    const data = await req.json();
    const attendance = await updateAttendance(params.id, data);
    if (!attendance)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(attendance);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    authMiddleware(req, ["admin", "employee"]);
    const attendance = await getAttendanceById(params.id);
    if (!attendance)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(attendance);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
