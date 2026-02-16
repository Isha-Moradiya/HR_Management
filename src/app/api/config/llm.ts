import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY!,
});

function extractJson(text: string) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
}

export async function runLLM({
    prompt,
    model = "mistral-small-latest",
    temperature = 0.2,
}: {
    prompt: string;
    model?: string;
    temperature?: number;
}) {
    const response = await mistral.chat.complete({
        model,
        temperature,
        messages: [
            {
                role: "system",
                content:
                    "You are an API. Return ONLY valid JSON. No markdown. No extra text.",
            },
            { role: "user", content: prompt },
        ],
    });

    const raw = response.choices[0].message.content as string;
    return extractJson(raw);
}
