import AttendanceModel from "../models/attendance";
import mongoose from "mongoose";

export async function createAttendance(data: any) {
  return await AttendanceModel.create(data);
}

export async function updateAttendance(id: string, data: any) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await AttendanceModel.findByIdAndUpdate(id, data, { new: true });
}

export async function getUserAttendanceByMonth(userId: string, month: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return await AttendanceModel.find({
    employee: userId,
    date: { $gte: start, $lt: end },
  }).sort({ date: 1 });
}

export async function getAttendanceById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await AttendanceModel.findById(id);
}

export function isAttendanceLocked(dateStr: string) {
  const attendanceDate = new Date(dateStr);
  const now = new Date();
  const diff =
    (now.getTime() - attendanceDate.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 2;
}
