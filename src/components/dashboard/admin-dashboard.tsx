"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardContent } from "@/components/admin/dashboard-content";
import { DepartmentList } from "@/components/admin/department-list";
import { EmployeeList } from "@/components/admin/employee-list";
import { AttendanceCalendar } from "@/components/admin/attendance-calendar";
import { EmployeeProfile } from "@/components/employee/employee-profile";

export function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );

  const renderContent = () => {
    if (selectedEmployeeId) {
      return (
        <EmployeeProfile
          employeeId={selectedEmployeeId}
          onBack={() => setSelectedEmployeeId(null)}
          userRole="admin"
        />
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <DashboardContent userRole="admin" />;
      case "departments":
        return <DepartmentList />;
      case "employees":
        return <EmployeeList onViewEmployee={setSelectedEmployeeId} />;
      case "attendance":
        return <AttendanceCalendar userRole="admin" />;
      default:
        return <DashboardContent userRole="admin" />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      userRole="admin"
      selectedEmployeeId={selectedEmployeeId}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
