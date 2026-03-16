const fetch = require('node-fetch');

async function testGemini15() {
  const API_KEY = "AIzaSyDmiEPgBZABGKXOxjjj3kQcfavansY9e0E";
  const modelId = "gemini-flash-latest"; 
  const prompt = "Generate a professional 2D scientific SVG schematic of a HeNe laser. Return ONLY the SVG code.";

  console.log(`Testing Gemini 1.5 Flash...`);
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Response Error:", response.status, err);
        return;
    }

    const data = await response.json();
    console.log("Success! Data received.");
    if (data.candidates && data.candidates[0].content.parts[0].text) {
        console.log("SVG Sample:", data.candidates[0].content.parts[0].text.substring(0, 100));
    } else {
        console.log("No text in parts.");
    }
  } catch (err) {
    console.error(err);
  }
}

testGemini15();
