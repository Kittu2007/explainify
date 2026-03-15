import OpenAI from "openai";

const getClient = () => {
  const apiKey = process.env.NVIDIA_LLM_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NVIDIA_LLM_API_KEY environment variable.");
  }
  return new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey,
  });
};

const LLM_MODEL = "deepseek-ai/deepseek-v3.1";

/**
 * Answer a question using retrieved document context (RAG).
 * Returns the AI-generated answer.
 */
export async function askWithContext(
  question: string,
  contextChunks: string[]
): Promise<string> {
  const context = contextChunks
    .map((chunk, i) => `[Source ${i + 1}]\n${chunk}`)
    .join("\n\n");

  const client = getClient();
  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Explainify, an elite institutional knowledge assistant. 

Instructions:
- Answer the user's question based strictly on the provided document context.
- Start your answer immediately. NEVER use introductory filler like "Of course", "Based on the document", or "Sure".
- Be authoritative, professional, and concise.
- Cite sources using [Source N] notation.
- If the context is insufficient, state exactly what information is missing.
- Use clean, semantic Markdown formatting.`,
      },
      {
        role: "user",
        content: `## Document Context\n${context}\n\n## Question\n${question}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content || "No response generated.";
}

/**
 * Generate a concise summary of document content.
 */
export async function summarize(text: string): Promise<string> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Explainify, an executive summarization assistant. 

Instructions:
- Provide a high-level executive summary.
- NEVER start with "Of course", "Here is a summary", or "This document explains".
- Start with the most important value proposition or finding.
- Use hierarchical headers (# for main, ## for sections).
- Highlight key statistics, dates, or technical metrics in bold.
- Use professional, punchy bullet points.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content || "No summary generated.";
}

/**
 * Generate a structured video explanation script.
 * Returns a JSON-compatible object with scenes for video generation.
 */
export async function generateVideoScript(
  topic: string,
  contextChunks: string[]
): Promise<{
  title: string;
  description: string;
  scenes: Array<{
    sceneNumber: number;
    narration: string;
    visual: string;
    duration: number;
  }>;
}> {
  const context = contextChunks.length
    ? contextChunks.map((chunk, i) => `[Source ${i + 1}]\n${chunk}`).join("\n\n")
    : "No specific document context provided. Generate based on general knowledge.";

  const client = getClient();
  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Explainify, a visual learning assistant. Create a structured video explanation script. Return ONLY a valid JSON object with this exact structure:
{
  "title": "Video title",
  "description": "Brief description of what this video explains",
  "scenes": [
    {
      "sceneNumber": 1,
      "narration": "What the narrator says",
      "visual": "Description of what should be shown (chart, diagram, infographic, animation, etc.)",
      "duration": 15
    }
  ]
}

Rules:
- Create 4-8 scenes
- Each scene should be 10-20 seconds
- Visuals should be descriptive enough to generate charts/diagrams
- Narration should be clear and educational
- Return ONLY the JSON object, no markdown or extra text`,
      },
      {
        role: "user",
        content: `## Topic\n${topic}\n\n## Document Context\n${context}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2048,
  });

  const text =
    response.choices[0]?.message?.content || '{"title":"","description":"","scenes":[]}';

  // Parse the JSON from the response (handle markdown code blocks)
  const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(jsonStr);
}

/**
 * Stream a question response from the AI.
 */
export async function askWithContextStream(
  question: string,
  contextChunks: string[]
) {
  const context = contextChunks
    .map((chunk, i) => `[Source ${i + 1}]\n${chunk}`)
    .join("\n\n");

  const client = getClient();
  return client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Explainify, an elite institutional knowledge assistant. 
- Answer based ONLY on context.
- Start your answer immediately. NO FILLER.
- Cite sources like [Source N].
- Clean Markdown only.`,
      },
      {
        role: "user",
        content: `## Document Context\n${context}\n\n## Question\n${question}`,
      },
    ],
    temperature: 0.2,
    stream: true,
  });
}
