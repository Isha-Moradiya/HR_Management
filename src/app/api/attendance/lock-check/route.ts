import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAttendanceLocked } from "../../services/attendance.service";

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin", "employee"]);
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    if (!date) {
      return NextResponse.json({ error: "date required" }, { status: 400 });
    }
    const locked = isAttendanceLocked(date);
    return NextResponse.json({ locked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
