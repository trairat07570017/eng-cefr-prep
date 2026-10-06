"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DailyArticle } from "@/types/news";
import { InteractiveReader } from "@/components/reader/InteractiveReader";
import { DEMO_SAMPLE_ARTICLES } from "@/lib/storage/articleCache";
import {
  Newspaper,
  Loader2,
  AlertCircle,
  Sparkles,
  BookOpenCheck,
  PenTool,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DailyReaderPage() {
  const [article, setArticle] = useState<DailyArticle | null>(null);
  const [category, setCategory] = useState<"education" | "technology" | "environment">("education");
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchArticle = useCallback(async (selectedCat: "education" | "technology" | "environment", force = false) => {
    setErrorNotice(null);
    const today = new Date().toISOString().split("T")[0];
    const cacheStorageKey = `eng_cefr_daily_article_${selectedCat}`;

    // 1. Check local browser cache if not forcing refresh
    if (!force && typeof window !== "undefined") {
      try {
        const localCachedRaw = localStorage.getItem(cacheStorageKey);
        if (localCachedRaw) {
          const parsed = JSON.parse(localCachedRaw);
          if (parsed && (parsed.date === today || parsed.id)) {
            setArticle(parsed);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to fetch
      }
    }

    setIsLoading(true);

    try {
      let customApiKey = "";
      let targetLevel = "B2";
      try {
        customApiKey = localStorage.getItem("eng_cefr_gemini_api_key") || "";
        targetLevel = localStorage.getItem("eng_cefr_target_level") || "B2";
      } catch {
        // LocalStorage fallback
      }

      const res = await fetch("/api/daily-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCat,
          targetLevel,
          userApiKey: customApiKey || undefined,
          forceRefresh: force,
        }),
      });

      const data = await res.json();
      if (data.success && data.article) {
        setArticle(data.article);
        try {
          localStorage.setItem(cacheStorageKey, JSON.stringify(data.article));
        } catch {
          // Ignore cache save error
        }
        if (data.notice) {
          setErrorNotice(data.notice);
        }
      } else {
        // Fallback to sample article
        const fallback = DEMO_SAMPLE_ARTICLES[selectedCat] || DEMO_SAMPLE_ARTICLES.education;
        setArticle(fallback);
        setErrorNotice(data.error || "เกิดข้อผิดพลาด จึงแสดงบทความตัวอย่างสำหรับการฝึก");
      }
    } catch (err) {
      console.error("[DailyReaderPage] Fetch error:", err);
      const fallback = DEMO_SAMPLE_ARTICLES[selectedCat] || DEMO_SAMPLE_ARTICLES.education;
      setArticle(fallback);
      setErrorNotice("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ จึงแสดงบทความตัวอย่างสำหรับการฝึก");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticle(category, false);
  }, [category, fetchArticle]);

  return (
    <div className="space-y-8">
      {/* Top Welcome Quick Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-1 border border-blue-500/20">
            <Sparkles className="w-3 h-3" />
            <span>ภารกิจรายวัน 20–30 นาที</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <span>อ่านข่าวภาษาอังกฤษประจำวัน (Daily Reader)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            ข่าวจริงย่อยเป็นระดับ B1–B2 แตะคำศัพท์เพื่อดูคำแปล และกดฟังเสียงอ่านได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vocab"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>คลังคำศัพท์</span>
          </Link>
          <Link
            href="/writing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <PenTool className="w-3.5 h-3.5 text-violet-400" />
            <span>ห้องฝึกเขียน</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Reader View or Loading Skeleton */}
      {isLoading && !article ? (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <div>
            <h3 className="font-semibold text-white text-base">กำลังโหลดและจัดเตรียมข่าวประจำวัน...</h3>
            <p className="text-xs text-slate-400 mt-1">
              ระบบกำลังดึงข้อมูลจาก RSS และแปลงเนื้อหาให้ตรงกับกรอบมาตรฐาน CEFR
            </p>
          </div>
        </div>
      ) : article ? (
        <InteractiveReader
          article={article}
          selectedCategory={category}
          onSelectCategory={(cat) => {
            setCategory(cat);
          }}
          onRefresh={() => fetchArticle(category, true)}
          isLoading={isLoading}
          notice={errorNotice || undefined}
        />
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-slate-300 text-sm">ไม่พบบทความ กรุณากดลองใหม่อีกครั้ง</p>
          <button
            onClick={() => fetchArticle(category, true)}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}
    </div>
  );
}
