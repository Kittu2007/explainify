import Bytez from "bytez.js";

const BYTEZ_API_KEY = "81d39941feece495da52cdab0ae92694";
const sdk = new Bytez(BYTEZ_API_KEY);

/**
 * Generate a video clip using Google Veo 2.0.
 * Returns the video as a binary stream/base64 or URL if available.
 * 
 * Note: Bytez.js returns data in different formats based on the model.
 */
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const MODELS = [
  "sourceful/riverflow-v2-pro", // Primary OpenRouter Image Model
  "google/veo-2.0-generate-001",
  "@cf/bytedance/stable-video-diffusion-img2vid-xt",
  "stabilityai/stable-diffusion-xl-base-1.0"
];

/**
 * Generate a visual clip using Riverflow V2 Pro or fallbacks.
 */
export async function generateVideoClip(prompt: string): Promise<string> {
  let lastError = "";
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("[VisualGen] CRITICAL: OPENROUTER_API_KEY is missing from environment variables.");
  }
  
  for (const modelId of MODELS) {
    try {
      console.log(`[VisualGen] Attempting generation with model: ${modelId}`);
      
      // Special handling for OpenRouter models
      if (modelId.includes("/")) {
        if (!apiKey) throw new Error("OpenRouter API key missing");

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://explainify-ai.onrender.com",
            "X-Title": "Explainify"
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: prompt
                  }
                ]
              }
            ],
            modalities: ["image"]
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`[VisualGen] OpenRouter API Error (${response.status}):`, errText);
          
          if (response.status === 402) {
             throw new Error("OPENROUTER_CREDIT_SHORTFALL");
          }
          
          throw new Error(`OpenRouter error ${response.status}: ${errText.substring(0, 100)}`);
        }

        const data = await response.json();
        const images = data.choices?.[0]?.message?.images;
        
        if (images && images.length > 0) {
          console.log(`[VisualGen] Successfully generated image via ${modelId}`);
          return images[0];
        }

        // Check content if images array is missing
        const content = data.choices?.[0]?.message?.content;
        if (content && (content.startsWith("http") || content.startsWith("data:image"))) {
          console.log(`[VisualGen] Successfully found image URL in content via ${modelId}`);
          return content;
        }

        console.warn(`[VisualGen] Model ${modelId} returned no images/valid content:`, JSON.stringify(data).substring(0, 200));
        throw new Error("No visual output from OpenRouter");
      }

      // Existing ByteZ/Native logic fallback
      const model = sdk.model(modelId);
      const { error, output } = await model.run(prompt);

      if (error) {
        console.warn(`[VisualGen] Model ${modelId} failed:`, error);
        lastError = typeof error === 'string' ? error : JSON.stringify(error);
        continue;
      }

      if (!output) continue;

      if (output instanceof Buffer) {
        const base64 = output.toString("base64");
        const mime = modelId.includes("video") || modelId.includes("veo") ? "video/mp4" : "image/png";
        return `data:${mime};base64,${base64}`;
      }

      if (typeof output === 'string') {
        if (output.startsWith("http") || output.startsWith("data:")) return output;
        return `data:image/png;base64,${output}`;
      }

      if (output && typeof output === 'object' && (output as any).uri) {
        return (output as any).uri;
      }
    } catch (err: any) {
      console.error(`[VisualGen] Exception with ${modelId}:`, err.message);
      lastError = err.message;
    }
  }

  throw new Error(`All visual generation models failed. Last error: ${lastError}`);
}
