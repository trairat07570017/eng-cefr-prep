import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = body.apiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "ยังไม่ได้ระบุ API Key" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Respond with the word 'OK' only.",
    });

    if (response.text) {
      return NextResponse.json({
        success: true,
        message: "เชื่อมต่อกับ Gemini API สำเร็จสมบูรณ์!",
      });
    }

    return NextResponse.json({ success: false, error: "ไม่ได้รับการตอบกลับจาก Gemini" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
