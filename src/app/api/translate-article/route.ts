import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, generateContentWithFallback } from "@/lib/gemini/client";
import { DEMO_SAMPLE_ARTICLES } from "@/lib/storage/articleCache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = (body.title || "").trim();
    const paragraphs = (body.paragraphs || []) as string[];
    const category = body.category as "education" | "technology" | "environment" | undefined;
    const userApiKey = body.userApiKey as string | undefined;

    if (!paragraphs || paragraphs.length === 0) {
      return NextResponse.json(
        { success: false, error: "ไม่พบเนื้อหาย่อหน้าสำหรับแปล" },
        { status: 400 }
      );
    }

    // Check if matching demo sample article
    if (category && DEMO_SAMPLE_ARTICLES[category]) {
      const sample = DEMO_SAMPLE_ARTICLES[category];
      if (sample.title.toLowerCase() === title.toLowerCase() && sample.paragraphsTh) {
        return NextResponse.json({
          success: true,
          titleTh: sample.titleTh,
          paragraphsTh: sample.paragraphsTh,
          source: "preset",
        });
      }
    }

    // Call Gemini to translate paragraphs into natural Thai
    const ai = getGeminiClient(userApiKey);
    const prompt = `You are a professional bilingual English-Thai translator and language teacher.
Translate the following English news headline and paragraphs into natural, fluent, and precise Thai suitable for Thai educators preparing for the CEFR examination.

English Headline:
${title}

English Paragraphs:
${paragraphs.map((p, i) => `[${i + 1}] ${p}`).join("\n\n")}

Instructions:
1. Translate the headline into a concise, natural Thai title.
2. Translate each numbered paragraph into an accurate, natural Thai paragraph corresponding strictly 1-to-1 with the original order.
3. Use natural Thai phrasing while preserving academic nuance.

Return ONLY a valid JSON object matching this schema (no markdown, no code block ticks):
{
  "titleTh": "ชื่อข่าวภาษาไทย...",
  "paragraphsTh": [
    "คำแปลย่อหน้าที่ 1...",
    "คำแปลย่อหน้าที่ 2..."
  ]
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      titleTh: parsed.titleTh || title,
      paragraphsTh: parsed.paragraphsTh || paragraphs,
      source: "gemini",
    });
  } catch (error: unknown) {
    console.error("[API translate-article Error]:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
