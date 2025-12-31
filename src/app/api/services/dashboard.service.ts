import Attendance from "@/app/api/models/attendance";
import User from "../models/user";

export async function getEmployeeCount() {
  return await User.countDocuments();
}

export async function getMonthlyAttendance(year: number) {
  return await Attendance.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, status: "$status" },
        count: { $sum: 1 },
      },
    },
  ]);
}

// 3. Employee count per department
export async function getDepartmentCount() {
  return await User.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } },
  ]);
}

// 4. Employee count for selected skills (AND/OR)
export async function getSkillStats(skills: string[], operator: "AND" | "OR") {
  const query =
    operator === "AND"
      ? { skill_set: { $all: skills } }
      : { skill_set: { $in: skills } };
  return await User.countDocuments(query);
}

// 5. All available skills
export function getAllSkills() {
  return ["JavaScript", "Python", "Java", "React", "Node.js"];
}
