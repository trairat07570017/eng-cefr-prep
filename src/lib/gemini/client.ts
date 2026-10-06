import { GoogleGenAI } from "@google/genai";

// Use gemini-3.5-flash-lite as primary because free tier allows 500 requests/day (vs 20/day on 3.8)
export const PRIMARY_MODEL = "gemini-3.5-flash-lite";
export const FALLBACK_MODELS = ["gemini-3.8-flash", "gemini-3.5-flash"];

export function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "MISSING_GEMINI_API_KEY: กรุณาระบุ Gemini API Key ในการตั้งค่า (Settings) หรือใน Environment Variable (GEMINI_API_KEY)"
    );
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: string | any;
    config?: any;
    primaryModel?: string;
  }
) {
  const models = [params.primaryModel || PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: any = null;

  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return res;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini] Model ${model} failed, trying next candidate:`, err?.message || err);
      // If error is invalid API key or bad syntax, do not retry other models
      if (err?.status === 400 || err?.status === 401 || err?.status === 403) {
        throw err;
      }
      // If error is 429 (rate limit) or 503 (high demand), continue loop to next model!
    }
  }

  throw lastError;
}
