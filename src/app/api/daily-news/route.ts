import { NextRequest, NextResponse } from "next/server";
import { fetchRssNewsItem } from "@/lib/rss/fetcher";
import { rewriteNewsToCefr } from "@/lib/gemini/rewriter";
import { getCachedArticle, setCachedArticle, DEMO_SAMPLE_ARTICLES } from "@/lib/storage/articleCache";
import { DailyArticle } from "@/types/news";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get("category") || "education") as "education" | "technology" | "environment" | "general";
    const level = (searchParams.get("level") || "B2") as "B1" | "B2";
    const today = new Date().toISOString().split("T")[0];

    // Check cache
    const cached = getCachedArticle(today, category, level);
    if (cached) {
      return NextResponse.json({ success: true, article: cached, source: "cache" });
    }

    // Check if server API key is configured
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
    if (!hasApiKey) {
      // Return built-in sample demo article so UI always functions smoothly
      const sample = DEMO_SAMPLE_ARTICLES[category] || DEMO_SAMPLE_ARTICLES.education;
      return NextResponse.json({
        success: true,
        article: sample,
        source: "demo",
        notice: "ระบบกำลังแสดงบทความตัวอย่าง เนื่องจากยังไม่ได้ระบุ GEMINI_API_KEY",
      });
    }

    // Fetch and adapt live news
    const rawNews = await fetchRssNewsItem(category);
    const adaptedArticle = await rewriteNewsToCefr(rawNews, level);
    setCachedArticle(adaptedArticle);

    return NextResponse.json({ success: true, article: adaptedArticle, source: "live" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการดึงข่าว";
    console.error("[API daily-news GET Error]:", error);

    // Fallback to sample article on error
    const fallback = DEMO_SAMPLE_ARTICLES.education;
    return NextResponse.json(
      { success: false, error: message, fallbackArticle: fallback },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = (body.category || "education") as "education" | "technology" | "environment" | "general";
    const targetLevel = (body.targetLevel || "B2") as "B1" | "B2";
    const userApiKey = body.userApiKey as string | undefined;
    const forceRefresh = Boolean(body.forceRefresh);
    const today = new Date().toISOString().split("T")[0];

    // If not forcing refresh, check cache first
    if (!forceRefresh) {
      const cached = getCachedArticle(today, category, targetLevel);
      if (cached) {
        return NextResponse.json({ success: true, article: cached, source: "cache" });
      }
    }

    // Fetch fresh news and rewrite using Gemini
    const rawNews = await fetchRssNewsItem(category);
    let adaptedArticle: DailyArticle;

    try {
      adaptedArticle = await rewriteNewsToCefr(rawNews, targetLevel, userApiKey);
      setCachedArticle(adaptedArticle);
    } catch (apiError: unknown) {
      const errMsg = apiError instanceof Error ? apiError.message : String(apiError);
      
      // If missing API key and no server key, return sample with explanation
      if (errMsg.includes("MISSING_GEMINI_API_KEY")) {
        const sample = DEMO_SAMPLE_ARTICLES[category] || DEMO_SAMPLE_ARTICLES.education;
        return NextResponse.json({
          success: true,
          article: sample,
          source: "demo",
          notice: "กรุณาระบุ Gemini API Key ในเมนูตั้งค่า เพื่อดึงและแปลงข่าวสารสดใหม่",
        });
      }
      throw apiError;
    }

    return NextResponse.json({ success: true, article: adaptedArticle, source: "live" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการประมวลผลข่าว";
    console.error("[API daily-news POST Error]:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
