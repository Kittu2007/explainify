import OpenAI from "openai";

const apiKey = process.env.NVIDIA_LLM_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing NVIDIA_LLM_API_KEY environment variable. " +
      "Copy .env.example to .env.local and fill in your NVIDIA LLM API key."
  );
}

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey,
});

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

  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Explainify, an intelligent knowledge assistant. Answer the user's question based ONLY on the provided document context. If the context doesn't contain enough information to answer, say so clearly.

Be thorough, accurate, and cite which source(s) you used in your answer (e.g., [Source 1]).

Rules:
- Answer based strictly on the provided context
- Cite sources using [Source N] notation
- If the answer spans multiple sources, mention all relevant ones
- If the context is insufficient, clearly state what information is missing
- Use clear, well-structured formatting`,
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
  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Explainify, an intelligent summarization assistant. Generate a comprehensive yet concise summary of the document content provided by the user.

Instructions:
- Capture all key points, findings, and conclusions
- Organize the summary with clear structure (use headers if appropriate)
- Keep it concise but don't miss important details
- Use bullet points for lists of items
- Highlight any notable statistics, dates, or figures`,
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
