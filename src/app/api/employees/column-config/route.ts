import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../middleware/authMiddleware";

// Dummy config, replace with DB logic if needed
const defaultConfig = [
  "firstName",
  "lastName",
  "email",
  "department",
  "salary",
  "joiningDate",
];

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin"]);
    return NextResponse.json(defaultConfig);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
