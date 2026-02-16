import * as z from "zod";

const createServerEnv = () => {
    const EnvSchema = z.object({
        SECRET_KEY: z.string(),
        MONGODB_URI: z.string().optional(),
        JWT_SECRET: z.string().optional(),
        CRYPTO_SECRET: z.string().optional(),
        EMAIL_USER: z.string().optional(),
        EMAIL_PASS: z.string().optional(),
        ADMIN_EMAIL: z.string().optional(),
        ADMIN_EMAIL_PASS: z.string().optional(),
    });

    const parsedEnv = EnvSchema.safeParse(process.env);

    if (!parsedEnv.success) {
        throw new Error(`❌ Invalid SERVER env provided. The following variables are missing or invalid:${Object.entries(parsedEnv.error.flatten().fieldErrors).map(([k, v]) => `- ${k}: ${v}`).join("\n")}`);
    }

    return parsedEnv.data;
};

export const serverEnv = createServerEnv();
