import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getEmployeeCount } from "../../services/dashboard.service";

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    const count = await getEmployeeCount();
    return NextResponse.json({ count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}