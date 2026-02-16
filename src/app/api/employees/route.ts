import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../middleware/authMiddleware";
import { createEmployee, getEmployees } from "../services/employee.service";
import Department from "../models/department";
import { promisify } from "util";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { getAllUsers } from "../services/users.service";

export async function GET(req: NextRequest) {
  try {
    authMiddleware(req, ["admin", "employee"]);
    const url = new URL(req.url);
    const filters: any = {};
    if (url.searchParams.get("department")) {
      filters.department = url.searchParams.get("department");
    }
    if (url.searchParams.get("skillset")) {
      filters.skillset = url.searchParams.get("skillset");
    }
    const employees = await getAllUsers(filters);
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  authMiddleware(req, ["admin"]);

  const formData = await req.formData();

  const firstName = formData.get("firstName")?.toString() || "";
  const lastName = formData.get("lastName")?.toString() || "";
  const dob = formData.get("dob")?.toString() || "";
  const joiningDate = formData.get("joiningDate")?.toString() || "";
  const departmentId = formData.get("department")?.toString() || "";
  const salary = Number(formData.get("salary")?.toString() || "0");
  const email = formData.get("email")?.toString() || "";

  const allowedSkills = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
  ] as const;
  const skillset = formData
    .getAll("skillset")
    .map((s) => s.toString())
    .filter((s): s is (typeof allowedSkills)[number] =>
      allowedSkills.includes(s as (typeof allowedSkills)[number])
    );

  // ✅ Check if department ID is valid
  const department = await Department.findOne({
    _id: departmentId,
  });

  if (!department) {
    return NextResponse.json({ error: "Invalid department" }, { status: 400 });
  }

  const file = formData.get("avatar") as any;
  if (!file || typeof file.stream !== "function") {
    return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
  }

  const filename = `${Date.now()}-${file.name}`;
  const filePath = `public/uploads/${filename}`;

  // Ensure the uploads directory exists
  const fs = require("fs");
  if (!fs.existsSync("public/uploads")) {
    fs.mkdirSync("public/uploads", { recursive: true });
  }

  // Save file using stream
  const streamPipeline = promisify(pipeline);
  try {
    await streamPipeline(file.stream(), createWriteStream(filePath));
  } catch (err: any) {
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }

  const employee = await createEmployee({
    firstName,
    lastName,
    dob: new Date(dob),
    joiningDate: new Date(joiningDate),
    department: department._id,
    avatar: `/uploads/${filename}`,
    salary,
    email,
    skillset,
  });

  return NextResponse.json(employee);
}
