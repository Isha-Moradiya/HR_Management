"use client"

import type * as React from "react"
import { Building2, Calendar, LayoutDashboard, Users, User, FileText, Clock, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import UserRole from "@/app/dashboard/page"

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentPage: string
  setCurrentPage: (page: string) => void
  userRole: "admin" | "employee"
}

export function DashboardSidebar({ currentPage, setCurrentPage, userRole, ...props }: DashboardSidebarProps) {
  const adminNavItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      key: "dashboard",
    },
    {
      title: "Employees",
      icon: Users,
      key: "employees",
    },
    {
      title: "Departments",
      icon: Building2,
      key: "departments",
    },
    {
      title: "Attendance",
      icon: Calendar,
      key: "attendance",
    },
    
  ]

  const employeeNavItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      key: "dashboard",
    },
    {
      title: "Profile",
      icon: User,
      key: "profile",
    },
    {
      title: "Attendance",
      icon: Calendar,
      key: "attendance",
    },
   
  ]

  const navItems = userRole === "admin" ? adminNavItems : employeeNavItems

  return (
    <Sidebar collapsible="icon" className="bg-slate-900 border-r-0" {...props}>
      <SidebarHeader className="py-4 bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Building2 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-white">HRO</span>
            <span className="truncate text-xs text-slate-400">HR Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900">
        <SidebarMenu className="px-2 py-4">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                isActive={currentPage === item.key}
                onClick={() => setCurrentPage(item.key)}
                tooltip={item.title}
                className="text-slate-300 hover:text-white hover:bg-slate-800 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600 data-[active=true]:to-purple-600 data-[active=true]:text-white"
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="py-4 bg-slate-900">
        <div className="flex flex-col gap-2">
          {/* <div className="flex items-center gap-2 text-sm">
            <Badge variant={userRole === "admin" ? "default" : "secondary"} className="text-xs">
              {userRole === "admin" ? "Admin" : "Employee"}
            </Badge>
          </div> */}
          <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800">
            <Settings className="size-4" />
            <span>Settings</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
