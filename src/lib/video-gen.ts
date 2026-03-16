import Bytez from "bytez.js";

const BYTEZ_API_KEY = "81d39941feece495da52cdab0ae92694";
const sdk = new Bytez(BYTEZ_API_KEY);

/**
 * Generate a video clip using Google Veo 2.0.
 * Returns the video as a binary stream/base64 or URL if available.
 * 
 * Note: Bytez.js returns data in different formats based on the model.
 */
const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY;
const NVIDIA_VISUAL_API_KEY = process.env.NVIDIA_VISUAL_API_KEY;

const MODELS = [
  "nvidia/stable-diffusion-3-medium", // High-Fidelity NVIDIA NIM Engine
  "google/gemini-flash-latest", // Permanent Scientific SVG Figure Generator
  "sourceful/riverflow-v2-pro", // Primary OpenRouter Image Model
  "google/veo-2.0-generate-001",
  "@cf/bytedance/stable-video-diffusion-img2vid-xt",
  "stabilityai/stable-diffusion-xl-base-1.0"
];

/**
 * Generate a visual clip using Gemini SVG or fallbacks.
 */
export async function generateVideoClip(prompt: string): Promise<string> {
  let lastError = "";
  const apiKey = process.env.OPENROUTER_API_KEY;
  const googleApiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;

  if (!apiKey && !googleApiKey) {
    console.error("[VisualGen] CRITICAL: Both API keys are missing from environment variables.");
  }
  
  for (const modelId of MODELS) {
    try {
      console.log(`[VisualGen] Attempting generation with model: ${modelId}`);
      
      // Special handling for NVIDIA NIM (High-Fidelity Images)
      if (modelId.startsWith("nvidia/")) {
        if (!NVIDIA_VISUAL_API_KEY) {
          console.error("[VisualGen] NVIDIA Visual API Key is MISSING in runtime.");
          throw new Error("NVIDIA_API_KEY_MISSING");
        }

        const nvidiaModelName = modelId.split('/')[1];
        const invokeUrl = `https://ai.api.nvidia.com/v1/genai/stabilityai/${nvidiaModelName}`;

        const response = await fetch(invokeUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NVIDIA_VISUAL_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "prompt": prompt,
            "cfg_scale": 5,
            "aspect_ratio": "16:9",
            "seed": 0,
            "steps": 40
          })
        });

        if (!response.ok) {
           const errText = await response.text();
           console.error(`[VisualGen] NVIDIA API Error (${response.status}):`, errText);
           if (response.status === 429) throw new Error("NVIDIA_RATE_LIMIT");
           throw new Error(`NVIDIA API Error: ${response.status}`);
        }

        const data = await response.json();
        // NVIDIA returns base64 in data.image or data.artifacts[0].base64
        const base64Data = data.image || (data.artifacts && data.artifacts[0]?.base64);
        
        if (base64Data) {
          console.log("[VisualGen] Successfully generated image via NVIDIA NIM");
          return `data:image/png;base64,${base64Data}`;
        }
        
        throw new Error("Invalid output from NVIDIA NIM");
      }

      // Special handling for Google AI Studio (SVG Generation)
      if (modelId.startsWith("google/gemini")) {
        if (!googleApiKey) {
          console.error("[VisualGen] Google AI Studio Key is MISSING in runtime.");
          throw new Error("GOOGLE_API_KEY_MISSING");
        }
        
        const shortModelId = modelId.split('/')[1];
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${shortModelId}:generateContent?key=${googleApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${prompt}\n\nStrict Requirement: Generate a high-fidelity, professional 2D scientific SVG schematic. Clean academic style, university-grade labels, white background. Return the SVG code directly.`
              }]
            }]
          })
        });

        if (!response.ok) {
           const errText = await response.text();
           console.error(`[VisualGen] Google API Error (${response.status}):`, errText);
           
           if (response.status === 429) {
             throw new Error("GOOGLE_RATE_LIMIT");
           }
           throw new Error(`Google API Error: ${response.status}`);
        }

        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        // Robust Regex for SVG extraction
        const svgMatch = rawContent.match(/<svg[\s\S]*?<\/svg>/);
        if (svgMatch) {
          const svgCode = svgMatch[0];
          console.log("[VisualGen] Successfully extracted SVG via Gemini");
          const encodedSvg = Buffer.from(svgCode).toString('base64');
          return `data:image/svg+xml;base64,${encodedSvg}`;
        }
        
        console.warn("[VisualGen] Model returned text but no SVG block found:", rawContent.substring(0, 100));
        throw new Error("Invalid SVG output from Gemini");
      }

      // Special handling for OpenRouter models
      if (modelId.includes("/") && !modelId.startsWith("google/")) {
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
