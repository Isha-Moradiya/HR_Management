"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/app/dashboard/page";

interface AttendanceCalendarProps {
  userRole: UserRole;
}

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | null;
  editable: boolean;
}

const employees = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
];

export function AttendanceCalendar({ userRole }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(
    userRole === "admin" ? employees[0].id : "current-user"
  );
  const [attendanceData, setAttendanceData] = useState<
    Record<string, AttendanceRecord>
  >({});

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isDateEditable = (date: Date) => {
    if (userRole === "admin") return true;

    const daysDiff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 1; // Current day and 1 day back
  };

  const getDateKey = (day: number) => {
    return `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  };

  const toggleAttendance = (day: number) => {
    const dateKey = getDateKey(day);
    const date = new Date(currentYear, currentMonth, day);

    if (!isDateEditable(date)) return;

    setAttendanceData((prev) => {
      const current = prev[dateKey];
      let newStatus: "present" | "absent" | null = "present";

      if (current?.status === "present") {
        newStatus = "absent";
      } else if (current?.status === "absent") {
        newStatus = null;
      }

      return {
        ...prev,
        [dateKey]: {
          date: dateKey,
          status: newStatus,
          editable: isDateEditable(date),
        },
      };
    });
  };

  const getAttendanceStatus = (day: number) => {
    const dateKey = getDateKey(day);
    return attendanceData[dateKey]?.status || null;
  };

  const getCellClassName = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const status = getAttendanceStatus(day);
    const editable = isDateEditable(date);
    const isToday = date.toDateString() === today.toDateString();

    return cn(
      "h-12 w-12 flex items-center justify-center rounded-lg border-2 text-sm font-medium transition-colors",
      {
        "bg-green-100 border-green-300 text-green-800": status === "present",
        "bg-red-100 border-red-300 text-red-800": status === "absent",
        "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed":
          !editable,
        "hover:bg-muted cursor-pointer": editable && !status,
        "border-primary border-4": isToday,
        "cursor-pointer": editable,
      }
    );
  };

  // Generate calendar days
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-12 w-12" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <div
        key={day}
        className={getCellClassName(day)}
        onClick={() => toggleAttendance(day)}
      >
        {day}
      </div>
    );
  }

  const getAttendanceStats = () => {
    const records = Object.values(attendanceData).filter((record) =>
      record.date.startsWith(
        `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`
      )
    );
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, total, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Attendance Calendar
              </CardTitle>
              <CardDescription>
                {userRole === "admin"
                  ? "Manage employee attendance records"
                  : "Mark your daily attendance"}
              </CardDescription>
            </div>
            {userRole === "admin" && (
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">{calendarDays}</div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-green-100 border-2 border-green-300 rounded"></div>
                <span className="text-sm">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-red-100 border-2 border-red-300 rounded"></div>
                <span className="text-sm">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                <span className="text-sm">Not Editable</span>
              </div>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.present}
                </div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.absent}
                </div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Attendance Rate
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {userRole === "admin" ? (
                  <>
                    <li>
                      • Click on any day to toggle between
                      Present/Absent/Unmarked
                    </li>
                    <li>
                      • Select different employees from the dropdown above
                    </li>
                    <li>• You can mark attendance for any day</li>
                  </>
                ) : (
                  <>
                    <li>
                      • Click on today or yesterday to mark your attendance
                    </li>
                    <li>• Green = Present, Red = Absent, Gray = Cannot edit</li>
                    <li>• You can only edit current day and previous 1 day</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
