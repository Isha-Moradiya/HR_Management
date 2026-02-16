import Company from "../models/company";
import User from "../models/user";

interface UpdateCompanyDetailsProps {
    userId: string;
    payload: {
        name?: string;
        phone?: string;
        website?: string;
        industry?: string;
        companySize?: string;
        description?: string;
        address?: string;
        logo?: string;
    };
}

// Get company details
export const getCompanyDetails = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const company = await Company.findById(user.companyId);
    if (!company) throw new Error("Company not found");

    return company;
};

// Update company details (Onboarding)
export const updateCompanyDetails = async ({
    userId,
    payload,
}: UpdateCompanyDetailsProps) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const company = await Company.findById(user.companyId);
    if (!company) throw new Error("Company not found");

    // Only set the fields from payload that exist
    Object.keys(payload).forEach((key) => {
        const value = payload[key as keyof typeof payload];
        if (value !== undefined) {
            (company as any)[key] = value;
        }
    });
    
    console.log("Payload keys:", Object.keys(payload));

    // Mark onboarding completed
    company.onboardingCompleted = true;

    await company.save();

    return company;
};
