import Bytez from "bytez.js";

const BYTEZ_API_KEY = "81d39941feece495da52cdab0ae92694";
const sdk = new Bytez(BYTEZ_API_KEY);

/**
 * Generate audio narration from text using OpenAI tts-1 via Bytez.
 * Returns the audio as a base64 Data URI.
 *
 * @param text - The script text to narrate
 */
export async function generateNarrationAudio(text: string): Promise<string> {
  try {
    console.log(`[TTS] Generating audio for: "${text.substring(0, 50)}..."`);
    
    // choose tts-1
    const model = sdk.model("openai/tts-1");

    // send input to model
    const { error, output } = await model.run(text);

    if (error) {
      console.error("[TTS] Generation error:", error);
      throw new Error(`TTS generation failed: ${JSON.stringify(error)}`);
    }

    if (output instanceof Buffer) {
      const base64 = output.toString("base64");
      return `data:audio/mp3;base64,${base64}`;
    }

    if (typeof output === 'string' && output.startsWith('data:')) {
       return output;
    }

    console.warn("[TTS] Unexpected output format:", typeof output);
    return "";
  } catch (err: any) {
    console.error("[TTS] Unhandled error:", err.message);
    throw err;
  }
}
