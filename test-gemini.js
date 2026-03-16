const fetch = require('node-fetch');

async function testGeminiImage() {
  const API_KEY = "AIzaSyDmiEPgBZABGKXOxjjj3kQcfavansY9e0E";
  const modelId = "gemini-2.0-flash-exp"; 
  const prompt = "Professional 2D scientific schematic of a HeNe laser. Include a central glass tube with glowing red gas, clear arrows pointing to the Anode and Cathode, and high-visibility text labels: 'He-Ne gas mixture', 'Output Coupler', 'High Reflector'. Clean textbook style, white background, 4k.";

  console.log(`Testing Gemini 2.0 Flash with prompt: ${prompt}`);
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["IMAGE"]
        }
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Response Error:", response.status, err);
        return;
    }

    const data = await response.json();
    console.log("Response Data Structure (Keys):", Object.keys(data));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const parts = data.candidates[0].content.parts;
        console.log("Parts count:", parts.length);
        parts.forEach((part, i) => {
            if (part.inlineData) {
                console.log(`Part ${i} Mime Type:`, part.inlineData.mimeType);
                console.log(`Part ${i} Data Start:`, part.inlineData.data.substring(0, 50));
            } else if (part.text) {
                console.log(`Part ${i} Text:`, part.text.substring(0, 100));
            }
        });
    } else {
        console.log("No candidates/parts found in response:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Fetch Exception:", err);
  }
}

testGeminiImage();
