import Bytez from "bytez.js";

const BYTEZ_API_KEY = "81d39941feece495da52cdab0ae92694";
const sdk = new Bytez(BYTEZ_API_KEY);

/**
 * Generate a video clip using Google Veo 2.0.
 * Returns the video as a binary stream/base64 or URL if available.
 * 
 * Note: Bytez.js returns data in different formats based on the model.
 */
const MODELS = [
  "google/veo-2.0-generate-001",
  "@cf/bytedance/stable-video-diffusion-img2vid-xt", // Alternative video model
  "stabilityai/stable-diffusion-xl-base-1.0" // Image fallback if video fails entirely
];

/**
 * Generate a video clip using Google Veo 2.0 with fallbacks.
 */
export async function generateVideoClip(prompt: string): Promise<string> {
  let lastError = "";
  
  for (const modelId of MODELS) {
    try {
      console.log(`[Veo] Attempting generation with model: ${modelId}`);
      const model = sdk.model(modelId);
      
      const { error, output } = await model.run(prompt);

      if (error) {
        console.warn(`[Veo] Model ${modelId} failed:`, error);
        lastError = typeof error === 'string' ? error : JSON.stringify(error);
        if (lastError.includes("balance") || lastError.includes("credit")) {
           console.log(`[Veo] Credit issue detected for ${modelId}, moving to next model...`);
           continue;
        }
        continue;
      }

      if (!output) continue;

      // Handle Buffer/Blob
      if (output instanceof Buffer) {
        const base64 = output.toString("base64");
        // Check if it's an image or video based on modelId
        const mime = modelId.includes("video") || modelId.includes("veo") ? "video/mp4" : "image/png";
        return `data:${mime};base64,${base64}`;
      }

      // Handle string (URL or direct)
      if (typeof output === 'string') {
        if (output.startsWith("http") || output.startsWith("data:")) return output;
        // If it's just a string, it might be base64 without prefix
        return `data:video/mp4;base64,${output}`;
      }

      // Handle object with uri
      if (output && typeof output === 'object' && (output as any).uri) {
        return (output as any).uri;
      }

      console.warn(`[Veo] Unrecognized output format for ${modelId}:`, typeof output);
    } catch (err: any) {
      console.error(`[Veo] Exception with ${modelId}:`, err.message);
      lastError = err.message;
    }
  }

  throw new Error(`All video generation models failed. Last error: ${lastError}`);
}
