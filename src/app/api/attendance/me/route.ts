import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getUserAttendanceByMonth } from "../../services/attendance.service";

export async function GET(req: NextRequest) {
  try {
    const { user } = authMiddleware(req, ["employee", "admin"]);
    const url = new URL(req.url);
    const month = url.searchParams.get("month");
    if (!month) {
      return NextResponse.json({ error: "month required" }, { status: 400 });
    }
    const records = await getUserAttendanceByMonth(user.userId, month);
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
