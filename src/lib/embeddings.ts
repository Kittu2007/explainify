import OpenAI from "openai";

const getClient = () => {
  const apiKey = process.env.NVIDIA_EMBED_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NVIDIA_EMBED_API_KEY environment variable.");
  }
  return new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey,
  });
};

const EMBEDDING_MODEL = "nvidia/llama-3.2-nv-nemoretriever-300m-embed-v1";

/**
 * Generate an embedding vector for a single text string.
 * Uses NVIDIA llama-3.2-nv-nemoretriever-300m-embed-v1 (2048 dimensions).
 *
 * @param text - Text to embed
 * @param inputType - "query" for search queries, "passage" for document indexing
 */
export async function generateEmbedding(
  text: string,
  inputType: "query" | "passage" = "query"
): Promise<number[]> {
  // Use model name suffix for input_type (NVIDIA's OpenAI-compat approach)
  const modelWithType = `${EMBEDDING_MODEL}-${inputType}`;

  const client = getClient();
  const response = await client.embeddings.create({
    input: text,
    model: modelWithType,
    encoding_format: "float",
  });
  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple text strings in batch (passage mode for indexing).
 * Processes in batches of 50 to respect API limits.
 */
export async function generateEmbeddings(
  texts: string[],
  inputType: "query" | "passage" = "passage"
): Promise<number[][]> {
  const BATCH_SIZE = 50;
  const allEmbeddings: number[][] = [];
  const modelWithType = `${EMBEDDING_MODEL}-${inputType}`;

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const client = getClient();
    const response = await client.embeddings.create({
      input: batch,
      model: modelWithType,
      encoding_format: "float",
    });

    // Sort by index to maintain order
    const sorted = response.data.sort((a, b) => a.index - b.index);
    allEmbeddings.push(...sorted.map((d) => d.embedding));
  }

  return allEmbeddings;
}
