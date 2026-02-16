import { sendEmail } from "../../utils/emailSend";
import { runLLM } from "../../config/llm";
import { emailPrompt } from "../prompts/email.prompt";

interface EmailAgentProps {
    type: "OTP" | "RESET_PASSWORD" | "INVITE";
    to: string;
    name?: string;
    role?: string;
    codeOrLink: string;
    customMessage?: string;
}

export async function emailAgent(data: EmailAgentProps) {
    const result = await runLLM({
        prompt: emailPrompt(data),
    });

    await sendEmail({
        to: data.to,
        subject: result.subject,
        html: result.body,
    });
}
