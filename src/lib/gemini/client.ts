import { GoogleGenAI } from "@google/genai";

export const PRIMARY_MODEL = "gemini-3.8-flash";
export const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"];

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
      // If error is permission, bad request, or invalid key, do not retry other models
      if (err?.status === 400 || err?.status === 401 || err?.status === 403) {
        throw err;
      }
    }
  }

  throw lastError;
}
