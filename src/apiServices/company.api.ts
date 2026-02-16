import { api } from "@/lib/api-client";

export interface Company {
    id: string;
    email: string;
    name: string;
    phone?: string;
    website?: string;
    industry?: string;
    companySize?: string;
    address?: string;
    description?: string;
    logo?: string;
    onboardingCompleted: boolean;
}

export interface UpdateCompanyPayload {
    name?: string;
    phone?: string;
    website?: string;
    industry?: string;
    companySize?: string;
    description?: string;
    address?: string;
    logo?: File;
}

/* ================= GET COMPANY DETAILS ================= */
export const getCompanyDetails = async (userId: string): Promise<Company> => {
    const { data } = await api.get(`/company/${userId}`);
    return data.data;
};

/* ================= UPDATE COMPANY DETAILS ================= */
export const updateCompanyDetails = async (
    userId: string | undefined,
    payload: UpdateCompanyPayload
): Promise<Company> => {
    if (!userId) throw new Error("User ID is required");

    const formData = new FormData();
    formData.append("name", payload.name || "");
    formData.append("phone", payload.phone || "");
    formData.append("address", payload.address || "");
    formData.append("industry", payload.industry || "");
    formData.append("companySize", payload.companySize || "");
    formData.append("description", payload.description || "");

    if (payload.logo) {
        formData.append("logo", payload.logo as File); 
    }

    const { data } = await api.put(`/company/${userId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};
