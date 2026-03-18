const fetch = require('node-fetch');

async function testGeminiSVG() {
  const API_KEY = "AIzaSyDmiEPgBZABGKXOxjjj3kQcfavansY9e";
  const modelId = "gemini-2.0-flash"; 
  const prompt = "Generate a high-fidelity, professional 2D scientific SVG schematic of a HeNe laser. Include the discharge tube, anode, cathode, mirrors, and clear labels for each. Use a clean academic style. Return ONLY the SVG code without any markdown or conversational text.";

  console.log(`Testing Gemini 2.0 Flash for SVG generation...`);
  
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
        ]
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Response Error:", response.status, err);
        return;
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const svg = data.candidates[0].content.parts[0].text;
        console.log("Success! SVG generated.");
        console.log("SVG Start:", svg.substring(0, 100));
    } else {
        console.log("No candidates found.");
    }
  } catch (err) {
    console.error(err);
  }
}

testGeminiSVG();
