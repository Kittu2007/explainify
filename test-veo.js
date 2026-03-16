const Bytez = require("bytez.js");

async function testVeo() {
  const BYTEZ_API_KEY = "81d39941feece495da52cdab0ae92694";
  const sdk = new Bytez(BYTEZ_API_KEY);
  
  console.log("Testing Veo 2.0...");
  try {
    const model = sdk.model("google/veo-2.0-generate-001");
    const prompt = "A high-fidelity scientific diagram of a HeNe laser tube with glowing red gas, sleek futuristic schematic style, 4k resolution.";
    
    console.log(`Running model with prompt: "${prompt}"`);
    const startTime = Date.now();
    const { error, output } = await model.run(prompt);
    const duration = (Date.now() - startTime) / 1000;
    
    if (error) {
      console.error("Error:", error);
    } else {
      console.log(`Success! Duration: ${duration}s`);
      console.log("Output type:", typeof output);
      if (output instanceof Buffer) {
        console.log("Output is Buffer of size:", output.length);
      } else {
        console.log("Output:", JSON.stringify(output).substring(0, 100));
      }
    }
  } catch (err) {
    console.error("Unhandled error:", err);
  }
}

testVeo();
