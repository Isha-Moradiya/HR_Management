"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardContent } from "@/components/admin/dashboard-content";
import { AttendanceCalendar } from "@/components/admin/attendance-calendar";
import { EmployeeProfile } from "@/components/employee/employee-profile";

export function EmployeeDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent userRole="employee" />;
      case "profile":
        return (
          <EmployeeProfile employeeId="current-user" userRole="employee" />
        );
      case "attendance":
        return <AttendanceCalendar userRole="employee" />;
      default:
        return <DashboardContent userRole="employee" />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      userRole="employee"
    >
      {renderContent()}
    </DashboardLayout>
  );
}
