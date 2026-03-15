import pdf from "pdf-parse";
// Dynamic import or require since pdf2json might not have types
import PDFParser from "pdf2json";

/**
 * Extract text from a PDF buffer.
 * If pdf-parse crashes due to complex corrupted images, it falls back to pdf2json,
 * which operates in "text-only" mode and safely ignores heavy image streams.
 */
export async function extractText(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  try {
    // Primary extractor (fast, works for 95% of PDFs)
    const data = await pdf(buffer);
    return {
      text: data.text || "",
      pageCount: data.numpages || 1,
    };
  } catch (err: any) {
    console.warn("Primary PDF parsing failed due to images/corruption. Falling back to text-only mode:", err.message);

    // Fallback extractor (ignores images completely)
    return new Promise((resolve, reject) => {
      // 1 = text only, skips images
      const pdfParser = new PDFParser(null, 1 as any);

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("Fallback PDF Parsing Error:", errData.parserError);
        reject(new Error("Failed to parse PDF document. It may contain complex images, unsupported formatting, or password protection."));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent();
        // Decode the URI-encoded text from pdf2json and strip weird formatting
        const cleanText = decodeURIComponent(text)
          .replace(/----------------Page \(\d+\) Break----------------/g, "\n\n")
          .trim();
        
        resolve({
          // We don't get exact page count easily with raw text, estimate from length or default to 1
          text: cleanText,
          pageCount: 1, 
        });
      });

      pdfParser.parseBuffer(buffer);
    });
  }
}
