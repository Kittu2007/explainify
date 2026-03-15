import mammoth from "mammoth";

/**
 * Extract text content from a DOCX buffer.
 * Safely ignores embedded images and complex formatting.
 * Returns the full text and a simulated page count (estimated by word count).
 */
export async function extractWordText(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value || "";

    // Estimate page count (roughly 300 words per page)
    const wordCount = text.split(/\s+/).length;
    const estimatedPageCount = Math.max(1, Math.ceil(wordCount / 300));

    // Log any warnings from mammoth (like unhandled image types) without crashing
    if (result.messages && result.messages.length > 0) {
      console.warn("Mammoth extraction warnings:", result.messages);
    }

    return {
      text,
      pageCount: estimatedPageCount,
    };
  } catch (error) {
    console.error("Failed to extract text from DOCX:", error);
    throw new Error("Could not parse Word document. It may be corrupted or password protected.");
  }
}
