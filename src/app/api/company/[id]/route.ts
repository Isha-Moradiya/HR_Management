import { NextRequest } from "next/server";
import { connectDB } from "@/app/api/config/database";
import { response } from "@/app/api/lib/response/responseHandler";
import {
    getCompanyDetails,
    updateCompanyDetails,
} from "@/app/api/services/company.service";
import { authMiddleware } from "@/app/api/middleware/authMiddleware";
import { getUploader, handleMultipart } from "../../middleware/upload";

export const config = { api: { bodyParser: false } };

// Get Company Details
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { user } = authMiddleware(req, ["admin"]);

        const company = await getCompanyDetails(user.userId);

        return response.success(company, "Company details fetched");
    } catch (error: any) {
        return response.internalServerError(error.message);
    }
}

// Update Company Details (Onboarding)
export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const { user } = authMiddleware(req, ["admin"]);

        const formData = await req.formData();

        const payload: any = Object.fromEntries(formData.entries());

        const logo = formData.get("logo") as File | null;
        if (logo && typeof logo !== "string") {
            payload.logo = logo.name;
        }

        const company = await updateCompanyDetails({
            userId: user.userId,
            payload,
        });

        return response.success(company, "Company onboarding completed");
    } catch (error: any) {
        return response.internalServerError(error.message);
    }
}
