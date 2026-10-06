import { GoogleGenAI } from "@google/genai";

export function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "MISSING_GEMINI_API_KEY: กรุณาระบุ Gemini API Key ในการตั้งค่า (Settings) หรือใน Environment Variable (GEMINI_API_KEY)"
    );
  }

  return new GoogleGenAI({ apiKey });
}
