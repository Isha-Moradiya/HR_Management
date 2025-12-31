"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/app/dashboard/page";
import { ThemeToggle } from "../theme/theme-toggle";

interface DashboardHeaderProps {
  userRole: UserRole;
  selectedEmployeeId?: string | null;
}

export function DashboardHeader({
  userRole,
  selectedEmployeeId,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const getBreadcrumb = () => {
    if (selectedEmployeeId) {
      return (
        <Breadcrumb>
          <BreadcrumbList>
            {/* <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-slate-600">
                Employees
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator /> */}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-black dark:text-white">
                Employee details
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    return (
      <Breadcrumb>
        <BreadcrumbList>
          {/* <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-slate-600">
              HR Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator /> */}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-black dark:text-white">
              Dashboard
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  if (!user) return null;

  return (
    <header className="flex py-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear  border-b border-slate-200 bg-white dark:bg-black text-black dark:text-white">
      <div className="flex items-center gap-2 px-4 flex-1">
        <SidebarTrigger className="-ml-1 text-black dark:text-white" />
        {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
        {getBreadcrumb()}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 bg-slate-50 border-slate-200 focus:outline-none transition-colors text-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 px-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative rounded-full border border-black dark:border-white"
        >
          <Bell className="h-5 w-4" />
          {notifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-slate-50 focus:outline-none focus:border-none p-0"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.avatar || "/default-profile.jpg"}
                  alt={user.firstName}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-black dark:text-white">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-300 ">
                  {user.role === "admin" ? "Administrator" : "Employee"}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
