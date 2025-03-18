import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error("API key is missing. Please set REACT_APP_GENERATIVE_AI_API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error("Invalid prompt. Prompt must be a non-empty string.");
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    if (!result || !result.response) {
      throw new Error("No valid response received from API.");
    }

    const responseData = result.response;

    if (!responseData.candidates || responseData.candidates.length === 0) {
      throw new Error("Invalid response received from the API. No data available. Try a different prompt.");
    }

    const responseText = responseData.candidates[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("The API response does not contain any text.");
    }

    console.log("API Response:", responseText);

    return responseText;
  } catch (error) {
    console.error("Error during API call:", error.message);
    return "⚠️ Error: Unable to process request. Please try again.";
  }
}

export default run;
