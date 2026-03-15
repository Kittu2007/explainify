import pdf from "pdf-parse";

/**
 * Extract text content from a PDF buffer.
 * Returns the full text and page count.
 */
export async function extractText(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  const data = await pdf(buffer);
  return {
    text: data.text,
    pageCount: data.numpages,
  };
}
