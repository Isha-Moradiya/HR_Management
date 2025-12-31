"use client"

import type * as React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { UserRole } from "@/app/dashboard/page"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage: string
  setCurrentPage: (page: string) => void
  userRole: UserRole
  selectedEmployeeId?: string | null
}

export function DashboardLayout({
  children,
  currentPage,
  setCurrentPage,
  userRole,
  selectedEmployeeId,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userRole={userRole} />
      <SidebarInset>
        <DashboardHeader userRole={userRole} selectedEmployeeId={selectedEmployeeId} />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
