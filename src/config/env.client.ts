import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const env = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!env.success) {
  throw new Error(
    "❌ Invalid client environment variables:\n" +
      JSON.stringify(env.error.flatten().fieldErrors, null, 2)
  );
}

export const clientEnv = {
  API_URL: env.data.NEXT_PUBLIC_API_URL,
};
