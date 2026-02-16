import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../middleware/authMiddleware";
import { createAttendance, getUserAttendanceByMonth } from "../services/attendance.service";

export async function POST(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    const data = await req.json();
    const attendance = await createAttendance(data);
    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const month = url.searchParams.get("month");
    if (!userId || !month) {
      return NextResponse.json(
        { error: "userId and month required" },
        { status: 400 }
      );
    }
    const records = await getUserAttendanceByMonth(userId, month);
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
