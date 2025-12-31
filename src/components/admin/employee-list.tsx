"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, Users, Settings } from "lucide-react";
import { EmployeeFormModal } from "@/components/employee-form-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEmployeeApi } from "@/lib/api/employee";
import type { User } from "@/app/api/types/model";
import { useRouter } from "next/navigation";
import { getEmployees } from "@/app/api/services/employee.service";

export interface EmployeeListProps {
  onViewEmployee?: (employeeId: string) => void;
}

const availableColumns = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "dob", label: "DOB" },
  { key: "joiningDate", label: "Joining Date" },
  { key: "department", label: "Department" },
  { key: "salary", label: "Salary" },
  { key: "skillset", label: "Skills" },
  { key: "avatar", label: "Photo" },
];

// for example (SSR- Server Side Rendering)
// export const getServerSideProps = async () => {
//   const res = await getEmployees();
//   const employees = await res.json(); 

//   return {
//     props: { employees },
//   };
// };

export function EmployeeList({ onViewEmployee }: EmployeeListProps) {
  const router = useRouter();
  const { getEmployees, createEmployee, updateEmployee, deleteEmployee } =
    useEmployeeApi();
  const [employees, setEmployees] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    employee: User | null;
  }>({
    isOpen: false,
    employee: null,
  });
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "firstName",
    "lastName",
    "email",
    "department",
    "joiningDate",
  ]);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error: any) {
      console.error("Failed to fetch employees:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        router.push("/login");
      } else {
        setError("Failed to load employees. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: User) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = (employee: User) => {
    setDeleteConfirm({ isOpen: true, employee });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.employee) {
      try {
        setError(null);
        await deleteEmployee(deleteConfirm.employee._id!);
        await fetchEmployees();
        setDeleteConfirm({ isOpen: false, employee: null });
      } catch (error: any) {
        console.error("Failed to delete employee:", error);
        if (error.message.includes("401") || error.message.includes("403")) {
          router.push("/login");
        } else {
          setError("Failed to delete employee. Please try again later.");
        }
      }
    }
  };

  const handleSaveEmployee = async (employeeData: Omit<User, "id">) => {
    try {
      setError(null);
      if (editingEmployee) {
        await updateEmployee(editingEmployee._id!, employeeData);
      } else {
        // Convert employeeData to FormData
        const formData = new FormData();

        // Only append avatar if it's a File
        if (
          typeof window !== "undefined" &&
          typeof File !== "undefined" &&
          employeeData.avatar &&
          (employeeData.avatar as any) instanceof File
        ) {
          formData.append("avatar", employeeData.avatar);
        }

        // Append other fields, but skip avatar
        Object.entries(employeeData).forEach(([key, value]) => {
          if (key === "avatar") return; // Skip avatar, already handled above
          if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });

        await createEmployee(formData);
      }
      await fetchEmployees();
      setIsFormOpen(false);
      setEditingEmployee(null);
    } catch (error: any) {
      console.error("Failed to save employee:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        router.push("/login");
      } else {
        setError("Failed to save employee. Please try again later.");
      }
    }
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((col) => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const renderCellContent = (employee: User, columnKey: string) => {
    switch (columnKey) {
      case "avatar":
        return (
          <img
            src={employee.avatar || "/placeholder.svg"}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="h-10 w-10 rounded-full object-cover"
          />
        );
      case "dob":
      case "joiningDate": {
        const rawValue = employee[columnKey];
        const date = rawValue ? new Date(rawValue) : null;
        return date && !isNaN(date.getTime()) ? date.toLocaleDateString() : "-";
      }
      case "salary":
        return employee.salary !== undefined && employee.salary !== null
          ? `$${employee.salary.toLocaleString()}`
          : "-";
      case "skillset":
        return (
          <div className="flex flex-wrap gap-1">
            {employee.skillset?.slice(0, 2).map((skill: any, index: number) => (
              <Badge
                key={
                  typeof skill === "string"
                    ? skill
                    : skill?.value || skill?.label || index
                }
                variant="secondary"
                className="text-xs"
              >
                {typeof skill === "string" ? skill : skill?.label || ""}
              </Badge>
            ))}
            {employee.skillset && employee.skillset.length > 2 && (
              <Badge
                key="extra-skill-count"
                variant="outline"
                className="text-xs"
              >
                +{employee.skillset.length - 2}
              </Badge>
            )}
          </div>
        );

      default: {
        const value = employee[columnKey as keyof User];
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        if (
          typeof value === "object" &&
          value !== null &&
          "toString" in value
        ) {
          // For ObjectId or similar
          return value.toString();
        }
        if (Array.isArray(value)) {
          return value.join(", ");
        }
        return value as React.ReactNode;
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Management
              </CardTitle>
              <CardDescription>
                Manage employee information and records
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Collapsible
                open={isColumnSettingsOpen}
                onOpenChange={setIsColumnSettingsOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute z-10 mt-2 p-4 bg-background border rounded-lg shadow-lg">
                  <div className="space-y-2 min-w-[200px]">
                    <Label className="text-sm font-medium">
                      Visible Columns
                    </Label>
                    {availableColumns?.map((column) => (
                      <div
                        key={column.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={column.key}
                          checked={visibleColumns.includes(column.key)}
                          onCheckedChange={() => toggleColumn(column.key)}
                        />
                        <Label htmlFor={column.key} className="text-sm">
                          {column.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Button onClick={handleAddEmployee}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns?.map((columnKey) => {
                    const column = availableColumns.find(
                      (col) => col.key === columnKey
                    );
                    return column ? (
                      <TableHead key={columnKey}>{column.label}</TableHead>
                    ) : null;
                  })}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees?.map((employee) => (
                  <TableRow key={employee._id}>
                    {visibleColumns.map((columnKey) => (
                      <TableCell key={columnKey}>
                        {renderCellContent(employee, columnKey)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, employee: null })}
        onConfirm={confirmDelete}
        title="Delete Employee"
        description={`Are you sure you want to delete ${deleteConfirm.employee?.firstName} ${deleteConfirm.employee?.lastName}? This action cannot be undone.`}
      />
    </div>
  );
}
