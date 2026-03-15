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
    // 1. Try standard text extraction first (fast)
    const result = await mammoth.extractRawText({ buffer });
    let text = result.value || "";

    // 2. If text is empty or very short, it might be a scanned Word doc
    if (text.trim().length < 50) {
      console.log("Word text is too short. Attempting OCR on embedded images...");
      
      const imageTexts: string[] = [];
      
      // Use convertToHtml to intercept images
      await mammoth.convertToHtml({ buffer }, {
        convertImage: mammoth.images.imgElement(async (image: any) => {
          const imageBuffer = await image.read();
          const { createWorker } = await import('tesseract.js');
          const worker = await createWorker('eng');
          try {
            const { data: { text: ocrText } } = await worker.recognize(Buffer.from(imageBuffer));
            imageTexts.push(ocrText);
          } finally {
            await worker.terminate();
          }
          return { src: "" }; // We don't need the HTML src
        })
      });

      if (imageTexts.length > 0) {
        text += "\n\n[OCR EXTRACTED CONTENT]\n" + imageTexts.join("\n\n");
      }
    }

    // Estimate page count (roughly 300 words per page)
    const wordCount = text.split(/\s+/).length;
    const estimatedPageCount = Math.max(1, Math.ceil(wordCount / 300));

    return {
      text,
      pageCount: estimatedPageCount,
    };
  } catch (error) {
    console.error("Failed to extract text from DOCX:", error);
    throw new Error("Could not parse Word document. It may be corrupted or password protected.");
  }
}
