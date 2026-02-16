import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getAllSkills } from "../../services/dashboard.service";

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    const skills = getAllSkills();
    return NextResponse.json(skills);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
