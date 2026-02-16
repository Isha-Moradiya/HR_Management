import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getSkillStats } from "../../services/dashboard.service";

export async function POST(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    const { skills, operator } = await req.json();
    if (!skills || !Array.isArray(skills) || !operator) {
      return NextResponse.json(
        { error: "skills and operator required" },
        { status: 400 }
      );
    }
    const count = await getSkillStats(skills, operator);
    return NextResponse.json({ count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
