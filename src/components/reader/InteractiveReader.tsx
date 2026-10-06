"use client";

import React, { useState } from "react";
import { DailyArticle, TargetVocabulary } from "@/types/news";
import { AudioPlayer } from "./AudioPlayer";
import { WordPopover } from "./WordPopover";
import { ComprehensionQuiz } from "./ComprehensionQuiz";
import {
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Bookmark,
  ExternalLink,
  BookOpen,
  Volume2,
  CheckCircle,
} from "lucide-react";
import { saveVocabItem } from "@/lib/storage/vocabStorage";

interface InteractiveReaderProps {
  article: DailyArticle;
  onSelectCategory: (category: "education" | "technology" | "environment") => void;
  onRefresh: () => void;
  isLoading: boolean;
  notice?: string;
}

export function InteractiveReader({
  article,
  onSelectCategory,
  onRefresh,
  isLoading,
  notice,
}: InteractiveReaderProps) {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(-1);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<TargetVocabulary | undefined>(undefined);
  const [savedAllSuccess, setSavedAllSuccess] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);

  // Normalize vocab list for quick matching
  const vocabMap = new Map<string, TargetVocabulary>();
  article.keyVocabulary?.forEach((v) => {
    vocabMap.set(v.word.toLowerCase(), v);
  });

  const handleWordClick = (rawWord: string) => {
    // Strip punctuation for matching
    const cleanWord = rawWord.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();
    if (!cleanWord || cleanWord.length < 2) return;

    setSelectedWord(cleanWord);
    setSelectedVocab(vocabMap.get(cleanWord));
  };

  const handleSaveAllVocab = () => {
    article.keyVocabulary?.forEach((v) => {
      saveVocabItem(v, article.title);
    });
    setSavedAllSuccess(true);
    setTimeout(() => setSavedAllSuccess(false), 3000);
  };

  const handleCompleteReading = () => {
    setCompletedToday(true);
    try {
      const currentStreak = parseInt(localStorage.getItem("eng_cefr_streak") || "1", 10);
      localStorage.setItem("eng_cefr_streak", String(currentStreak + 1));
      localStorage.setItem("eng_cefr_last_read_date", new Date().toISOString().split("T")[0]);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Category Pills & Refresh Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {(
            [
              { id: "education", label: "การศึกษา (Education)" },
              { id: "technology", label: "เทคโนโลยี (Tech)" },
              { id: "environment", label: "สิ่งแวดล้อม (Science)" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                article.category === cat.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          title="ดึงข่าวใหม่"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
          <span>{isLoading ? "กำลังประมวลผล..." : "สลับข่าวใหม่"}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            ระดับ CEFR {article.cefrLevel}
          </span>
          <span className="px-2.5 py-1 rounded-full font-medium bg-slate-800 text-slate-300">
            {article.wordCount} คำ
          </span>
          <span className="text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{article.date}</span>
          </span>
          <span className="text-slate-500">•</span>
          <a
            href={article.sourceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>แหล่งข่าว: {article.source}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
          {article.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 italic">
          พาดหัวข่าวต้นฉบับ: &ldquo;{article.originalTitle}&rdquo;
        </p>
      </div>

      {/* Web Speech Audio Player */}
      <AudioPlayer
        paragraphs={article.paragraphs}
        onParagraphChange={setActiveParagraphIndex}
      />

      {/* Interactive Article Reading Body */}
      <article className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-xl space-y-6 text-base sm:text-lg leading-relaxed text-slate-200">
        <div className="text-xs text-slate-500 flex items-center gap-2 pb-2 border-b border-slate-800/60 select-none">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>แตะหรือคลิกที่คำศัพท์ใดก็ได้ในบทความเพื่อดูคำแปลและความหมายทันที</span>
        </div>

        {article.paragraphs.map((paragraph, pIdx) => {
          const isActive = activeParagraphIndex === pIdx;
          const words = paragraph.split(/(\s+)/); // Preserve spaces

          return (
            <p
              key={pIdx}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-blue-600/10 border-l-4 border-blue-500 pl-4 text-white shadow-sm"
                  : "hover:bg-slate-900/30"
              }`}
            >
              {words.map((chunk, wIdx) => {
                if (/^\s+$/.test(chunk)) {
                  return <span key={wIdx}>{chunk}</span>;
                }

                const cleanWord = chunk.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();
                const isKeyVocab = vocabMap.has(cleanWord);

                return (
                  <span
                    key={wIdx}
                    onClick={() => handleWordClick(chunk)}
                    className={`cursor-pointer transition-all inline-block rounded px-0.5 ${
                      isKeyVocab
                        ? "text-blue-300 font-medium underline decoration-blue-500/60 decoration-dashed underline-offset-4 hover:bg-blue-500/20 hover:text-white"
                        : "hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {chunk}
                  </span>
                );
              })}
            </p>
          );
        })}
      </article>

      {/* Word Popover / Modal when clicked */}
      {selectedWord && (
        <WordPopover
          word={selectedWord}
          matchedVocab={selectedVocab}
          sourceArticleTitle={article.title}
          onClose={() => {
            setSelectedWord(null);
            setSelectedVocab(undefined);
          }}
        />
      )}

      {/* Target Vocabulary Section */}
      {article.keyVocabulary && article.keyVocabulary.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                คำศัพท์สำคัญประจำบทความ ({article.keyVocabulary.length} คำ)
              </h3>
            </div>

            <button
              onClick={handleSaveAllVocab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{savedAllSuccess ? "บันทึกครบทุกคำแล้ว!" : "บันทึกทุกคำลงคลังศัพท์"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {article.keyVocabulary.map((vocab, vIdx) => (
              <div
                key={vIdx}
                onClick={() => {
                  setSelectedWord(vocab.word);
                  setSelectedVocab(vocab);
                }}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                    {vocab.word}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {vocab.cefrLevel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {vocab.phonetic} • <span className="italic">{vocab.partOfSpeech}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium line-clamp-1">
                  {vocab.definitionTh}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comprehension Quiz */}
      {article.comprehensionQuestions && article.comprehensionQuestions.length > 0 && (
        <ComprehensionQuiz questions={article.comprehensionQuestions} />
      )}

      {/* Completion Button */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-base">เสร็จสิ้นการอ่านข่าววันนี้</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            สะสม Daily Streak และความคุ้นเคยกับภาษาอังกฤษสู่เป้าหมาย B2/C1 ใน 1 ปี
          </p>
        </div>

        <button
          onClick={handleCompleteReading}
          disabled={completedToday}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
            completedToday
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02]"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{completedToday ? "บันทึกการอ่านสำเร็จแล้ว" : "ทำเครื่องหมายว่าอ่านเสร็จแล้ว"}</span>
        </button>
      </div>
    </div>
  );
}
