import { api } from "@/lib/api-client";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    departmentId?: string;
    salary?: number;
    skillSet?: string[];
    dob?: string;
    joiningDate?: string;
    avatar?: string;
}

/* ================= GET ALL USERS ================= */
export interface GetAllUsersParams {
    companyId: string;
    role?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
}

export const getAllUsers = async (params: GetAllUsersParams): Promise<PaginatedUsers> => {
    const query = new URLSearchParams(params as any).toString();
    const { data } = await api.get(`/users?${query}`);
    return data;
};

/* ================= GET USER BY ID ================= */
export const getUserById = async (userId: string): Promise<User> => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
};

/* ================= UPDATE USER ================= */
export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    role?: string;
    status?: string;
    departmentId?: string;
    salary?: number;
    skillSet?: string[];
    dob?: string;
    joiningDate?: string;
    avatar?: string;
}

export const updateUser = async (
    userId: string,
    payload: UpdateUserPayload
): Promise<User> => {
    const { data } = await api.put(`/users/${userId}`, payload);
    return data;
};

/* ================= DELETE USER ================= */
export const deleteUser = async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
};
