/**
 * Split text into overlapping chunks for embedding.
 *
 * @param text - The full document text
 * @param chunkSize - Approximate number of characters per chunk (default: 1000)
 * @param overlap - Number of characters to overlap between chunks (default: 200)
 * @returns Array of text chunks
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  // Clean up the text — normalize whitespace
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (cleaned.length <= chunkSize) {
    return [cleaned];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = start + chunkSize;

    // Try to break at a sentence boundary
    if (end < cleaned.length) {
      const sentenceEnd = cleaned.lastIndexOf(". ", end);
      if (sentenceEnd > start + chunkSize * 0.5) {
        end = sentenceEnd + 1; // include the period
      }
    } else {
      end = cleaned.length;
    }

    chunks.push(cleaned.slice(start, end).trim());

    // Move forward by chunkSize minus overlap
    start = end - overlap;

    // Prevent infinite loop if overlap >= chunk
    if (start <= chunks.length * (chunkSize - overlap) - chunkSize) {
      start = end;
    }
  }

  return chunks.filter((chunk) => chunk.length > 0);
}
