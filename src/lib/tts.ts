import Bytez from "bytez.js";

const BYTEZ_API_KEY = "81d39941feece495da52cdab0ae92694";
const sdk = new Bytez(BYTEZ_API_KEY);

/**
 * Generate audio narration from text using OpenAI tts-1 via Bytez.
 * Returns the audio as a base64 Data URI.
 *
 * @param text - The script text to narrate
 */
/**
 * Generate audio narration Buffer from text.
 */
export async function generateNarrationBuffer(text: string): Promise<Buffer> {
  try {
    console.log(`[TTS] Buffer Gen: "${text.substring(0, 50)}..."`);
    const model = sdk.model("openai/tts-1");
    const { error, output } = await model.run(text);

    if (error) throw new Error(`TTS failed: ${JSON.stringify(error)}`);

    if (Buffer.isBuffer(output)) return output;
    
    if (typeof output === 'string' && output.startsWith('http')) {
      const res = await fetch(output);
      return Buffer.from(await res.arrayBuffer());
    }
    
    if (typeof output === 'string' && output.startsWith('data:')) {
      const base64 = output.split(',')[1];
      return Buffer.from(base64, 'base64');
    }

    throw new Error("Unsupported TTS output format");
  } catch (err: any) {
    console.error("[TTS] Buffer Error:", err.message);
    throw err;
  }
}

/**
 * Legacy wrapper: returns base64 Data URI
 */
export async function generateNarrationAudio(text: string): Promise<string> {
  const buffer = await generateNarrationBuffer(text);
  return `data:audio/mpeg;base64,${buffer.toString('base64')}`;
}
