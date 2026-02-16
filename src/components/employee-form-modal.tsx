"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";
import type { Department, User } from "@/app/api/types/model";
import { useEmployeeApi } from "@/apiServices/employee";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<User, "id">) => void;
  employee?: User | null;
}

export function EmployeeFormModal({
  isOpen,
  onClose,
  onSave,
  employee,
}: EmployeeFormModalProps) {
  const router = useRouter();
  const { getSkillSetOptions, getDepartmentOptions } = useEmployeeApi();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "" as Date | string,
    joiningDate: "" as Date | string,
    department: "",
    salary: 0,
    skillset: [] as string[],
    avatar: "/placeholder.svg?height=40&width=40",
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<
    Department[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [skills, departments] = await Promise.all([
        getSkillSetOptions(),
        getDepartmentOptions(),
      ]);
      setAvailableSkills(skills);
      setAvailableDepartments(departments);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      if (error.message.includes("Please log in")) {
        router.push("/login");
      } else {
        setError("Failed to load form data. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        dob: employee.dob,
        joiningDate: employee.joiningDate,
        department: employee.department?.toString() ?? "",
        salary: employee.salary ?? 0,
        skillset: employee.skillset ?? [],
        avatar: employee.avatar ?? "/placeholder.svg?height=40&width=40",
      });
      setPhotoPreview(employee.avatar ?? "/placeholder.svg?height=40&width=40");
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        joiningDate: "",
        department: "",
        salary: 0,
        skillset: [],
        avatar: "/placeholder.svg?height=40&width=40",
      });
      setPhotoPreview("");
    }
  }, [employee, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allowedSkills = [
      "JavaScript",
      "Python",
      "Java",
      "React",
      "Node.js",
    ] as const;
    const preparedFormData = {
      ...formData,
      dob:
        typeof formData.dob === "string"
          ? new Date(formData.dob)
          : formData.dob,
      joiningDate:
        typeof formData.joiningDate === "string"
          ? new Date(formData.joiningDate)
          : formData.joiningDate,
      skillset: (formData.skillset as string[]).filter(
        (skill): skill is (typeof allowedSkills)[number] =>
          allowedSkills.includes(skill as (typeof allowedSkills)[number])
      ),
      role: employee?.role ?? "employee",
      _id: employee?._id,
    };
    onSave(preparedFormData);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        setFormData((prev) => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview("");
    setFormData((prev) => ({
      ...prev,
      photo: "/placeholder.svg?height=40&width=40",
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skill_set: prev.skillset.includes(skill)
        ? prev.skillset.filter((s) => s !== skill)
        : [...prev.skillset, skill],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
          <DialogDescription>
            {employee
              ? "Update employee information"
              : "Create a new employee record"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={
                  typeof formData.dob === "string"
                    ? formData.dob
                    : formData.dob
                    ? formData.dob.toISOString().slice(0, 10)
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dob: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                value={
                  typeof formData.joiningDate === "string"
                    ? formData.joiningDate
                    : formData.joiningDate
                    ? formData.joiningDate.toISOString().slice(0, 10)
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    joiningDate: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              {isLoading ? (
                <div className="text-sm text-gray-500">
                  Loading departments...
                </div>
              ) : (
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments?.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salary: Number(e.target.value),
                  }))
                }
                placeholder="Enter salary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Employee Photo</Label>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Photo preview"
                    className="h-16 w-16 rounded-full object-cover border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-muted/50">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload Photo</span>
                  </div>
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading skills...</div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSkills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.skillset.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{employee ? "Update" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
