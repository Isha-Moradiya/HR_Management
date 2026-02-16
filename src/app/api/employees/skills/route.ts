import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getSkillSetOptions } from "../../services/employee.service";

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin", "employee"]);
    const skills = getSkillSetOptions();
    return NextResponse.json(skills);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}