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

const LLM_MODEL = "google/gemma-3n-e4b-it";

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
    temperature: 0.2,
    top_p: 0.7,
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
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content || "No summary generated.";
}

/**
 * Generate a structured visual explanation plan.
 */
export async function generateVideoScript(
  topic: string,
  contextChunks: string[]
): Promise<{
  title: string;
  description: string;
  scenes: Array<{
    title: string;
    video_prompt: string;
    narration: string;
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
        content: `You are Explainify Technical Visualization Designer. Your task is to transform complex document content into a precise, High-Fidelity SCIENTIFIC VIDEO learning plan.
        
CRITICAL RULES:
1. FOCUS on technical accuracy, formal schematics, and functional diagrams from the document.
2. Every scene MUST have a precise 'video_prompt' targeting a professional scientific visualizer.
3. VISUAL STYLE: Use a "High-Fidelity Scientific Schematic" style. Think clean minimalist backgrounds, glowing technical elements, cross-sections (e.g., laser tube internals), and dynamic energy diagrams (e.g., energy level transitions).
4. For technical concepts like Lasers, describe components like 'pumping source', 'active medium', 'optical resonator', and 'output coupler'.
5. DESCRIBE the visuals: "Professional 3D schematic of a HeNe laser tube, showing the helium-neon gas mixture glowing orange-red inside a glass tube, 4k, technical precision, blueprint-like clarity."
6. The 'narration' should be a concise technical summary analysis of the segment.
7. NO abstract or irrelevant filler graphics.

Return ONLY a valid JSON object.

JSON Structure:
{
  "title": "Topic Title",
  "description": "Short explanation",
  "scenes": [
    {
      "title": "Lasing Core",
      "video_prompt": "Scientific 3D schematic cross-section of an Nd:YAG laser rod, showing light pulses from flash lamps reflecting into the crystal, 4k resolution, technical accuracy.",
      "narration": "The active medium, a neodymium-doped yttrium aluminum garnet crystal, is excited by optical pumping to create population inversion.",
      "duration": 15
    }
  ]
}

Rules: 5-8 scenes, 10-20s each. Return ONLY JSON.`,
      },
      {
        role: "user",
        content: `## Topic\n${topic}\n\n## Document Context\n${context}`,
      },
    ],
    temperature: 0.2, 
    top_p: 0.7,
    max_tokens: 3000,
  });

  const text =
    response.choices[0]?.message?.content || '{"title":"","description":"","scenes":[]}';

  // Parse the JSON from the response (handle markdown code blocks)
  const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Parse failed for video script:", text);
    throw new Error("AI generated an invalid video plan. Please try again.");
  }
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
    temperature: 0.2,
    top_p: 0.7,
    stream: true,
  });
}
