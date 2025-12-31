"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Gift,
  MoreHorizontal,
  TrendingDown,
  Filter,
} from "lucide-react";
import type { UserRole } from "@/app/dashboard/page";
import { useEmployeeApi } from "@/lib/api/employee";
import type { User } from "@/app/api/types/model";
import { useRouter } from "next/navigation";

interface EmployeeProfileProps {
  employeeId: string;
  onBack?: () => void;
  userRole: UserRole;
}

export function EmployeeProfile({
  employeeId,
  onBack,
  userRole,
}: EmployeeProfileProps) {
  const router = useRouter();
  const { getEmployeeById } = useEmployeeApi();
  const [activeTab, setActiveTab] = useState("personal");
  const [employee, setEmployee] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEmployeeById(employeeId);
      setEmployee(data);
    } catch (error: any) {
      console.error("Failed to fetch employee:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        router.push("/login");
      } else {
        setError("Failed to load employee details. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>;
  }

  if (!employee) {
    return <div className="text-center py-4">Employee not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      {/* Employee Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={employee.avatar || "/default-profile.jpg"}
                alt={`${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                {`${employee.firstName[0]}${employee.lastName[0]}`}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {`${employee.firstName} ${employee.lastName}`}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-600">
                  {employee.department?.toString()} -{" "}
                  {employee.role ? employee.role.toString() : "Employee"}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="personal">Personal details</TabsTrigger>
          <TabsTrigger value="job">Job information</TabsTrigger>
          <TabsTrigger value="salary">Salary details</TabsTrigger>
          <TabsTrigger value="payhistory">Pay history</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Employee personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white">
                    Full Name
                  </label>
                  <p className="text-slate-400">
                    {`${employee.firstName} ${employee.lastName}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">
                    Email
                  </label>
                  <p className="text-slate-400">{employee.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">
                    Department
                  </label>
                  <p className="text-slate-400">
                    {employee.department?.toString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">
                    Join Date
                  </label>
                  <p className="text-slate-400">
                    {employee.joiningDate
                      ? employee.joiningDate.toLocaleDateString?.() ??
                        employee.joiningDate.toString()
                      : ""}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">
                    Date of Birth
                  </label>
                  <p className="text-slate-400">
                    {employee.dob
                      ? employee.dob.toLocaleDateString?.() ??
                        employee.dob.toString()
                      : ""}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">
                    Skills
                  </label>
                  <p className="text-slate-400">
                    {employee.skillset?.join(", ") || "No skills listed"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>
                Employee job details and role information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white">
                    Department
                  </label>
                  <p className="text-slate-400">
                    {employee.department.toString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">
                    Join Date
                  </label>
                  <p className="text-slate-400">
                    {employee.joiningDate
                      ? employee.joiningDate.toLocaleDateString?.() ??
                        employee.joiningDate.toString()
                      : ""}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Role</label>
                  <p className="text-slate-400">
                    {employee.role || "Employee"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>Salary Details</CardTitle>
              <CardDescription>
                Employee compensation information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white">
                    Current Salary
                  </label>
                  <p className="text-slate-400">
                    ${employee.salary?.toLocaleString() || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payhistory">
          <Card>
            <CardHeader>
              <CardTitle>Pay History</CardTitle>
              <CardDescription>
                Employee payment history and records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Pay history content will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>
                Employee performance reviews and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Performance content will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
