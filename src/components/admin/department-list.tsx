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
import { Edit, Trash2, Plus, Building2 } from "lucide-react";
import { DepartmentFormModal } from "@/components/department-form-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";

export interface Department {
  id: string;
  name: string;
  logo: string;
  createdDate: string;
  status: "Active" | "Inactive";
}

interface DepartmentResponse {
  _id: string;
  department_name: string;
  logo: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface DepartmentListResponse {
  success: boolean;
  message: string;
  data: {
    departments: Department[];
    total: number;
    page: number;
    totalPages: number;
  };
}

// // for example (SSG- Static Site Generation)
// export const getStaticProps = async () => {
//   const res = await fetch("/api/departments");
//   const products = await res.json();

//   return {
//     props: { products },
//     revalidate: 60, // page automatically rebuild every 60 seconds
//   };
// };

export function DepartmentList() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    department: Department | null;
  }>({
    isOpen: false,
    department: null,
  });

  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [token]);

  const transformDepartment = (dept: DepartmentResponse): Department => ({
    id: dept._id,
    name: dept.department_name,
    logo: dept.logo,
    createdDate: dept.createdAt,
    status: dept.status === "active" ? "Active" : "Inactive",
  });

  const fetchDepartmentById = async (
    id: string
  ): Promise<Department | null> => {
    try {
      const response = await fetch(`/api/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch department");
      }
      const data: DepartmentResponse = await response.json();
      return transformDepartment(data);
    } catch (error: any) {
      console.error("Error fetching department:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch department",
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch departments");
      }

      const result: DepartmentListResponse = await response.json();

      console.log("🚀 ~ fetchDepartments ~ result:", result);

      // ✅ CORRECT
      setDepartments(result.data.departments);

      // // Optional (pagination)
      // setTotal(result.data.total);
      // setPage(result.data.page);
      // setTotalPages(result.data.totalPages);

    } catch (error: any) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch departments",
        variant: "destructive",
      });
    }
  };

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  const handleEditDepartment = async (department: Department) => {
    // Fetch the latest department data before editing
    const updatedDepartment = await fetchDepartmentById(department.id);
    if (updatedDepartment) {
      setEditingDepartment(updatedDepartment);
      setIsFormOpen(true);
    }
  };

  const handleDeleteDepartment = (department: Department) => {
    setDeleteConfirm({ isOpen: true, department });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.department) {
      try {
        const response = await fetch(
          `/api/departments/${deleteConfirm.department.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete department");
        }
        await fetchDepartments();
        setDeleteConfirm({ isOpen: false, department: null });
        toast({
          title: "Success",
          description: "Department deleted successfully",
          variant: "default",
        });
      } catch (error: any) {
        console.error("Error deleting department:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete department",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveDepartment = async (
    departmentData: Omit<Department, "id" | "createdDate">
  ) => {
    try {
      if (editingDepartment) {
        // Update existing department
        const response = await fetch(
          `/api/departments/${editingDepartment.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              department_name: departmentData.name,
              status: departmentData.status.toLowerCase(),
              logo: departmentData.logo,
            }),
          }
        );
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update department");
        }
        toast({
          title: "Success",
          description: "Department updated successfully",
          variant: "default",
        });
      } else {
        // Add new department
        const formData = new FormData();
        formData.append("department_name", departmentData.name);
        formData.append("status", departmentData.status.toLowerCase());
        if (departmentData.logo.startsWith("data:")) {
          const blob = await fetch(departmentData.logo).then((r) => r.blob());
          formData.append("logo", blob);
        }

        const response = await fetch("/api/departments", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create department");
        }
        toast({
          title: "Success",
          description: "Department created successfully",
          variant: "default",
        });
      }
      await fetchDepartments();
      setIsFormOpen(false);
      setEditingDepartment(null);
    } catch (error: any) {
      console.error("Error saving department:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save department",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Department Management
              </CardTitle>
              <CardDescription>
                Manage company departments and their information
              </CardDescription>
            </div>
            <Button onClick={handleAddDepartment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(departments) && departments?.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <img
                      src={department.logo || "/placeholder.svg"}
                      alt={`${department.department_name} logo`}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {department.department_name}
                  </TableCell>
                  <TableCell>
                    {new Date(department.createdDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        department.status === "Active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {department.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDepartment(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDepartment(department)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DepartmentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDepartment(null);
        }}
        onSave={handleSaveDepartment}
        department={editingDepartment}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, department: null })}
        onConfirm={confirmDelete}
        title="Delete Department"
        description={`Are you sure you want to delete the ${deleteConfirm.department?.name} department? This action cannot be undone.`}
      />
    </div>
  );
}
