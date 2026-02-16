import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getDepartmentCount } from "../../services/dashboard.service";

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    const data = await getDepartmentCount();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
