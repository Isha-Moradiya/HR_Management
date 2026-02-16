import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getMonthlyAttendance } from "../../services/dashboard.service";

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    const url = new URL(req.url);
    const year = parseInt(url.searchParams.get("year") || `${new Date().getFullYear()}`);
    const data = await getMonthlyAttendance(year);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}