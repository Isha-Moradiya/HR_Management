import { User } from "@/app/api/types/model";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const API_BASE_URL = "/api/employees";

export function useEmployeeApi() {
  const { token } = useAuth();
  const router = useRouter();

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const getEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployeeById = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch employee: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const createEmployee = async (employeeData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: employeeData,
      });
      if (!response.ok) {
        throw new Error(`Failed to create employee: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update employee: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete employee: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getSkillSetOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/skills`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch skills: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getDepartmentOptions = async () => {
    try {
      const response = await fetch(`/api/departments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getSkillSetOptions,
    getDepartmentOptions,
  };
}
