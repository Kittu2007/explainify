import Bytez from "bytez.js";

const BYTEZ_API_KEY = "81d39941feece495da52cdab0ae92694";
const sdk = new Bytez(BYTEZ_API_KEY);

/**
 * Generate a video clip using Google Veo 2.0.
 * Returns the video as a binary stream/base64 or URL if available.
 * 
 * Note: Bytez.js returns data in different formats based on the model.
 */
export async function generateVideoClip(prompt: string): Promise<string> {
  try {
    console.log(`[Veo] Generating video for prompt: "${prompt.substring(0, 50)}..."`);
    
    // choose veo-2.0-generate-001
    const model = sdk.model("google/veo-2.0-generate-001");

    // send input to model
    const { error, output } = await model.run(prompt);

    if (error) {
      console.error("[Veo] Generation error:", error);
      throw new Error(`Veo generation failed: ${JSON.stringify(error)}`);
    }

    // Output is typically a blob or a URL depending on the Bytez implementation for this model.
    // If it's a Buffer/Blob, we convert to base64 for easy transport in JSON to frontend.
    if (output instanceof Buffer) {
      const base64 = output.toString("base64");
      return `data:video/mp4;base64,${base64}`;
    }

    if (typeof output === 'string') {
       return output; // Might be a URL
    }

    // Fallback if it's an object with a uri
    if (output && typeof output === 'object' && (output as any).uri) {
       return (output as any).uri;
    }

    console.warn("[Veo] Unexpected output format:", typeof output);
    return "";
  } catch (err: any) {
    console.error("[Veo] Unhandled error:", err.message);
    throw err;
  }
}
