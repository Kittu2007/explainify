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
- Answer ONLY using the provided document context. 
- If the answer is not in the context, say "The provided document does not contain information about [topic]."
- NEVER make up information or use external knowledge.
- ALWAYS cite the source using [Source N] at the end of every relevant sentence.
- Use structured Markdown: bold key terms, use tables for comparisons, and lists for steps.
- Start your answer immediately. NO FILLER.`,
      },
      {
        role: "user",
        content: `## Document Context\n${context}\n\n## Question\n${question}`,
      },
    ],
    temperature: 0.1, // Lower temperature for higher precision
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
        content: `You are Explainify, a senior document analyst. 

Instructions:
- Provide a high-precision executive summary based ONLY on the provided text.
- START with a clear one-sentence definition of the document's purpose.
- Use hierarchical headers (# for main, ## for sections).
- IDENTIFY and highlight critical technical specs, dates, and metrics in **bold**.
- If the document contains math, logic, or processes, explain them step-by-step.
- DO NOT hallucinate common knowledge. If the text says 1+1=3, you report that the text says 1+1=3.
- NO introductory filler like "Here is the summary".`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.1,
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
    : "No specific document context provided.";

  const client = getClient();
  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Explainify Visual Learning Designer. Create a script for a high-end educational video. 
Return ONLY a valid JSON object.

CRITICAL VISUAL RULES:
- "visual" descriptions MUST describe GRAPHICAL elements like:
  - "Interactive Chart showing [data]"
  - "Dynamic Flowchart of [process]"
  - "Animated Infographic explaining [concept]"
  - "Vector Line Animation of [mechanism]"
- AVOID boring descriptions like "text on screen" or "man talking".
- Ensure the visuals are sophisticated and educational.

JSON Structure:
{
  "title": "Video title",
  "description": "Brief description",
  "scenes": [
    {
      "sceneNumber": 1,
      "narration": "Narration text",
      "visual": "Graphical description (Chart/Flowchart/Animation)",
      "duration": 15
    }
  ]
}

Rules: 4-8 scenes, 10-20s each. Return ONLY JSON.`,
      },
      {
        role: "user",
        content: `## Topic\n${topic}\n\n## Document Context\n${context}`,
      },
    ],
    temperature: 0.4,
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
- Answer based ONLY on context. If unknown, state so.
- CITE sources like [Source N]. 
- Use structured Markdown (bolding, tables, lists).
- NO FILLER. START IMMEDIATELY.`,
      },
      {
        role: "user",
        content: `## Document Context\n${context}\n\n## Question\n${question}`,
      },
    ],
    temperature: 0.1,
    stream: true,
  });
}
