import pdf from "pdf-parse";

/**
 * Extract text content from a PDF buffer.
 * Returns the full text and page count.
 */
export async function extractText(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  try {
    const data = await pdf(buffer);
    return {
      text: data.text || "",
      pageCount: data.numpages || 1,
    };
  } catch (err: any) {
    console.error("PDF Parsing Error:", err);
    throw new Error(
      "Failed to parse PDF document. It may contain complex images, unsupported formatting, or password protection."
    );
  }
}
