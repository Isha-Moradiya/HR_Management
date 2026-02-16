import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export interface AuthUser {
  userId: string;
  email: string;
  role: "admin" | "employee" | "hr";
  companyId: string;
}

export const authMiddleware = (
  req: NextRequest,
  allowedRoles: ("admin" | "employee" | "hr")[] = []
): { user: AuthUser } => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header missing or malformed");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as AuthUser;

    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      throw new Error("You are not authorized to access this resource");
    }

    if (!decoded.companyId) {
      throw new Error("Company context missing in token");
    }

    return { user: decoded };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
