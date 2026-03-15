import { createWorker } from 'tesseract.js';

/**
 * Perform OCR on a buffer (Image or PDF page).
 * Currently takes an image buffer and returns extracted text.
 */
export async function performOCR(imageBuffer: Buffer): Promise<string> {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageBuffer);
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    return "";
  } finally {
    await worker.terminate();
  }
}

/**
 * Helper to check if text extraction yielded enough "real" content.
 * If text is too short or just whitespace, it might be a scanned document.
 */
export function isScannedDocument(text: string): boolean {
  if (!text) return true;
  // If less than 50 characters, suspect it's scanned or just title/metadata
  return text.trim().length < 50;
}
