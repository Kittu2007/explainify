const fetch = require('node-fetch');

async function testOpenRouter() {
  const API_KEY = "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";
  const modelId = "sourceful/riverflow-v2-pro";
  const prompt = "Professional 2D scientific schematic of a HeNe laser. Include a central glass tube with glowing red gas, clear arrows pointing to the Anode and Cathode, and high-visibility text labels: 'He-Ne gas mixture', 'Output Coupler', 'High Reflector'. Clean textbook style, 4k.";

  console.log(`Testing OpenRouter with model: ${modelId}`);
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
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
        const err = await response.text();
        console.error("Response Error:", response.status, err);
        return;
    }

    const data = await response.json();
    if (data.choices && data.choices[0]) {
        const message = data.choices[0].message;
        console.log("Full Message Object:", JSON.stringify(message, null, 2));
    } else {
        console.log("No choices found in response:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Fetch Exception:", err);
  }
}

testOpenRouter();
