import { api } from "@/lib/api-client";

/* ================= DEPARTMENT TYPES ================= */

export interface Department {
  _id: string;
  department_name: string;
  logo?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

/* ================= GET ALL DEPARTMENTS ================= */

export interface GetAllDepartmentsParams {
  page?: number;
  limit?: number;
}

export interface PaginatedDepartments {
  departments: Department[];
  total: number;
  page: number;
  totalPages: number;
}

export const getAllDepartments = async (
  params?: GetAllDepartmentsParams
): Promise<PaginatedDepartments> => {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";

  const { data } = await api.get(`/departments${query}`);
  return data;
};

/* ================= GET DEPARTMENT BY ID ================= */

export const getDepartmentById = async (
  departmentId: string
): Promise<Department> => {
  const { data } = await api.get(`/departments/${departmentId}`);
  return data;
};

/* ================= CREATE DEPARTMENT ================= */

export interface CreateDepartmentPayload {
  department_name: string;
  status?: "active" | "inactive";
  logo?: File;
}

export const createDepartment = async (
  payload: CreateDepartmentPayload
): Promise<Department> => {
  const formData = new FormData();

  formData.append("department_name", payload.department_name);
  if (payload.status) formData.append("status", payload.status);
  if (payload.logo) formData.append("logo", payload.logo);

  const { data } = await api.post("/departments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

/* ================= UPDATE DEPARTMENT ================= */

export interface UpdateDepartmentPayload {
  department_name?: string;
  status?: "active" | "inactive";
  logo?: File | null;
}

export const updateDepartment = async (
  departmentId: string,
  payload: UpdateDepartmentPayload
): Promise<Department> => {
  const formData = new FormData();

  if (payload.department_name)
    formData.append("department_name", payload.department_name);

  if (payload.status)
    formData.append("status", payload.status);

  if (payload.logo instanceof File)
    formData.append("logo", payload.logo);

  const { data } = await api.put(
    `/departments/${departmentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/* ================= DELETE DEPARTMENT ================= */

export const deleteDepartment = async (
  departmentId: string
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/departments/${departmentId}`);
  return data;
};
