export function emailPrompt(data: {
    type: "OTP" | "RESET_PASSWORD" | "INVITE";
    name?: string;
    role?: string;
    codeOrLink: string;
    customMessage?: string;
}) {
    return `
You are a professional system email writer.

========================
EMAIL CONTEXT
========================
Email Type      : ${data.type}
Recipient Name  : ${data.name || "User"}
Recipient Role  : ${data.role || "N/A"}
Code / Link     : ${data.codeOrLink}
Extra Message   : ${data.customMessage || "N/A"}

========================
WRITING RULES
========================
- Use a professional, friendly, and clear tone
- Do NOT mention internal systems or technical terms
- Keep the email concise and readable
- Format email using clean HTML (<p>, <strong>, <a> only)

========================
TYPE-SPECIFIC RULES
========================
- OTP:
  - Clearly display the OTP code
  - Mention that the OTP is valid for 5 minutes only
  - Include a warning not to share the OTP

- RESET_PASSWORD:
  - Clearly include the reset password link
  - Add a security warning if the user did not request this action

- INVITE:
  - Mention the invited role clearly
  - Encourage the user to accept the invitation

========================
OUTPUT FORMAT (STRICT)
========================
Return ONLY valid JSON.
Do NOT add explanations, markdown, or extra text.

{
  "subject": "Email subject line",
  "body": "<html>Email HTML body</html>"
}
`;
}
