import { NextRequest } from "next/server";
import { acceptInvite } from "@/app/api/services/auth.service";
import { connectDB } from "@/app/api/config/database";
import { acceptInviteSchema } from "../../../../validations/auth.validation";
import { response } from "../../lib/response/responseHandler";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const data = acceptInviteSchema.parse(body);

        const result = await acceptInvite(data.token, {
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
        });

        return response.success(result, "Invitation accepted");
    } catch (error: any) {
        return response.internalServerError(error.message);
    }
}
