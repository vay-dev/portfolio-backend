import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api",
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL ?? "http://localhost:5000",
    "X-Title": "Vay Portfolio",
  },
});

export async function generateProjectDescription(project: {
  title: string;
  aiContext: string;
  techStack: string[];
  features?: string[];
  role?: string;
  status?: string;
  architectureNotes?: string;
}): Promise<string> {
  const prompt = `You are writing a deep, compelling project description for a developer portfolio.
This is NOT a generic summary — it should read like a real engineer wrote it: specific, technical, and honest about what was hard, what was interesting, and what it actually does.

Project details:
- Title: ${project.title}
- Role: ${project.role ?? "Solo Developer"}
- Status: ${project.status ?? "live"}
- Tech Stack: ${project.techStack.join(", ")}
${project.features?.length ? `- Key Features: ${project.features.join(", ")}` : ""}
${project.architectureNotes ? `- Architecture Notes: ${project.architectureNotes}` : ""}
- Context: ${project.aiContext}

Write a 3–4 paragraph description that:
1. Opens with what the project is and why it exists — the real problem it solves
2. Dives into the most technically interesting decisions or challenges (be specific about the stack choices, patterns used, why certain approaches were taken)
3. Highlights what makes it non-trivial to build — not just "I used React" but what the actual engineering looked like
4. Closes with current state, impact, or what you'd do differently

Tone: confident, technical, first-person. No buzzwords like "leveraged" or "seamless". Write like a senior engineer explaining their own work.`;

  const message = await client.messages.create({
    model: process.env.AI_MODEL ?? "openrouter/free",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  return block.text;
}

export async function generateAllDescriptions(project: {
  title: string;
  aiContext: string;
  techStack: string[];
  role?: string;
  status?: string;
  architectureNotes?: string;
}): Promise<{ shortDescription: string; fullDescription: string }> {
  const prompt = `You are writing project descriptions for a developer portfolio. Given the raw context below, generate TWO things:

1. SHORT DESCRIPTION (1–2 sentences, max 180 characters): A punchy, specific summary for list/card views. No fluff.
2. FULL DESCRIPTION (3–4 paragraphs): Deep, technical, first-person. What it is, why it exists, the hard engineering decisions, what makes it non-trivial. No buzzwords like "leveraged" or "seamless".

Project:
- Title: ${project.title}
- Role: ${project.role ?? "Solo Developer"}
- Status: ${project.status ?? "live"}
- Stack: ${project.techStack.join(", ")}
${project.architectureNotes ? `- Architecture Notes: ${project.architectureNotes}` : ""}
- Raw Context: ${project.aiContext}

Respond in this exact format with no extra text:
SHORT: <your short description here>
FULL: <your full description here>`;

  const message = await client.messages.create({
    model: process.env.AI_MODEL ?? "openrouter/free",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");

  const text = block.text;
  const shortMatch = text.match(/SHORT:\s*(.+?)(?=\nFULL:|$)/s);
  const fullMatch = text.match(/FULL:\s*([\s\S]+)/);

  return {
    shortDescription: shortMatch?.[1]?.trim() ?? "",
    fullDescription: fullMatch?.[1]?.trim() ?? text,
  };
}
