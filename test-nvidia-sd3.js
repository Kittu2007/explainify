const fetch = require('node-fetch');

async function testNvidiaSD3() {
  const API_KEY = "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";
  const invokeUrl = "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium";

  const payload = {
    "prompt": "A professional 2D scientific schematic of a HeNe laser, isolated on white background, high quality",
    "cfg_scale": 5,
    "aspect_ratio": "16:9",
    "seed": 0,
    "steps": 50
  };

  console.log("Testing NVIDIA SD3 Medium...");

  try {
    const response = await fetch(invokeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Response Error:", response.status, err);
        return;
    }

    const data = await response.json();
    console.log("Success! Data received.");
    if (data.artifacts && data.artifacts[0].base64) {
        console.log("Image received (Base64 length):", data.artifacts[0].base64.length);
    } else if (data.image) {
        console.log("Image received directly.");
    } else {
        console.log("Response structure:", JSON.stringify(data).substring(0, 200));
    }
  } catch (err) {
    console.error(err);
  }
}

testNvidiaSD3();
