import { NextRequest } from "next/server";
import { inviteUser } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { inviteUserSchema } from "../../../../validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const data = inviteUserSchema.parse(body);

        const result = await inviteUser(data);
        return response.success(result, "Invitation sent");
    } catch (error: any) {
        return response.internalServerError(error.message);
    }
}
