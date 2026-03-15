import OpenAI from "openai";

const getApiKey = () => {
  const apiKey = process.env.NVIDIA_RERANK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NVIDIA_RERANK_API_KEY environment variable.");
  }
  return apiKey;
};

const RERANK_MODEL = "nvidia/rerank-qa-mistral-4b";

export interface RerankResult {
  index: number;
  content: string;
  logit: number;
}

/**
 * Rerank a list of passages against a query using NVIDIA rerank-qa-mistral-4b.
 * Returns passages sorted by relevance (highest first).
 *
 * @param query - The user's question
 * @param passages - Array of text passages to rerank
 * @param topN - Number of top results to return (default: 5)
 */
export async function rerankPassages(
  query: string,
  passages: Array<{ content: string; index: number }>,
  topN: number = 5
): Promise<RerankResult[]> {
  const apiKey = getApiKey();
  const response = await fetch("https://integrate.api.nvidia.com/v1/ranking", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: RERANK_MODEL,
      query: { text: query },
      passages: passages.map((p) => ({ text: p.content })),
      top_n: topN,
      truncate: "END",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Reranking failed: ${response.status} ${error}`);
  }

  const data = await response.json();

  // Map results back with original content
  return data.rankings.map(
    (r: { index: number; logit: number }) => ({
      index: passages[r.index].index,
      content: passages[r.index].content,
      logit: r.logit,
    })
  );
}
