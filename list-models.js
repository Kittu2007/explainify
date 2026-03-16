const fetch = require('node-fetch');

async function listModels() {
  const API_KEY = "AIzaSyDmiEPgBZABGKXOxjjj3kQcfavansY9e0E";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

listModels();
