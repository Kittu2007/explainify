import OpenAI from "openai";

// NVIDIA's AI endpoints often share keys, but we use a dedicated one for TTS if provided,
// falling back to the LLM key.
const getClient = () => {
  const apiKey = process.env.NVIDIA_TTS_API_KEY || process.env.NVIDIA_LLM_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NVIDIA_TTS_API_KEY or NVIDIA_LLM_API_KEY environment variable.");
  }
  return new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey,
  });
};

const TTS_MODEL = "nvidia/magpie-tts-zeroshot";

/**
 * Generate audio narration from text using NVIDIA magpie-tts-zeroshot.
 * Returns the audio as a base64 Data URI (e.g., "data:audio/mp3;base64,...").
 * This allows the frontend to play it immediately without needing file storage.
 *
 * @param text - The script text to narrate
 */
export async function generateNarrationAudio(text: string): Promise<string> {
  const client = getClient();
  const response = await client.audio.speech.create({
    model: TTS_MODEL,
    input: text,
    voice: "nova", // Magpie TTS accepts standard OpenAI voice names, usually mapped to its own internal voices
    response_format: "mp3", 
  });

  // Convert the array buffer response to a base64 string
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");

  return `data:audio/mp3;base64,${base64}`;
}
