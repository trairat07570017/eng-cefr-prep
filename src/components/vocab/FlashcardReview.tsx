"use client";

import React, { useState } from "react";
import { StoredVocabularyItem, reviewVocabItem } from "@/lib/storage/vocabStorage";
import {
  Volume2,
  RotateCw,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowLeft,
  Award,
  Layers,
} from "lucide-react";

interface FlashcardReviewProps {
  items: StoredVocabularyItem[];
  onExit: () => void;
}

export function FlashcardReview({ items, onExit }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ again: 0, good: 0, mastered: 0 });

  if (!items || items.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">ไม่มีคำศัพท์ที่ต้องทบทวนในรอบนี้!</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          ยอดเยี่ยมมาก! คุณได้ทบทวนคำศัพท์ที่ถึงกำหนดครบถ้วนแล้ว หรือสามารถเลือกทบทวนคำศัพท์ทั้งหมดได้
        </p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          กลับสู่คลังคำศัพท์
        </button>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const handleSpeak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRate = (outcome: "again" | "good" | "mastered") => {
    reviewVocabItem(currentItem.id, outcome);

    setStats((prev) => ({
      ...prev,
      [outcome]: prev[outcome] + 1,
    }));

    if (currentIndex + 1 < items.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-6 max-w-lg mx-auto my-8 animate-scaleUp">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-teal-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-xl">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">ทบทวนคำศัพท์ครบถ้วนแล้ว!</h2>
          <p className="text-sm text-slate-400 mt-1">
            ระบบได้คำนวณและตั้งเวลาทบทวนรอบถัดไปตามหลัก Spaced Repetition (SRS)
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-xl font-bold text-rose-400 block">{stats.again}</span>
            <span className="text-[11px] text-slate-400">ต้องทบทวนซ้ำ</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-xl font-bold text-blue-400 block">{stats.good}</span>
            <span className="text-[11px] text-slate-400">จำได้ดี</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xl font-bold text-emerald-400 block">{stats.mastered}</span>
            <span className="text-[11px] text-slate-400">แม่นยำระดับ 5</span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.01] transition-transform"
        >
          กลับสู่คลังคำศัพท์
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ออกจากการทบทวน</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            คำที่ {currentIndex + 1} จาก {items.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flip Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative min-h-[340px] sm:min-h-[380px] rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-700/80 p-8 shadow-2xl cursor-pointer select-none flex flex-col justify-between transition-all hover:border-slate-600 group"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            CEFR {currentItem.cefrLevel}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              กล่องระดับที่ {currentItem.reviewStage}/5
            </span>
            <button
              onClick={handleSpeak}
              className="p-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
              title="ฟังเสียงอ่าน"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Body (Front / Back toggle) */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="text-center my-auto space-y-3 py-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {currentItem.word}
            </h2>
            <div className="text-sm text-slate-400 font-mono">
              {currentItem.phonetic} •{" "}
              <span className="italic">{currentItem.partOfSpeech}</span>
            </div>
            <p className="text-xs text-slate-500 pt-6 flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>แตะเพื่อพลิกดูคำแปลและความหมาย</span>
            </p>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="my-auto space-y-4 py-4 animate-fadeIn">
            <div className="text-center pb-2 border-b border-slate-800">
              <span className="text-xs text-indigo-400 font-semibold block uppercase tracking-wider">
                ความหมายภาษาไทย
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {currentItem.definitionTh}
              </h3>
            </div>

            <div className="space-y-1 text-center">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">
                English Definition
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentItem.definitionEn}
              </p>
            </div>

            {currentItem.exampleSentence && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic text-center">
                &ldquo;{currentItem.exampleSentence}&rdquo;
              </div>
            )}
          </div>
        )}

        {/* Card Footer Hint */}
        <div className="text-center pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
          {!isFlipped
            ? "คลิกหรือแตะการ์ดเพื่อดูคำตอบ"
            : "ประเมินความจำของคุณด้านล่างเพื่อกำหนดรอบทบทวน"}
        </div>
      </div>

      {/* SRS Rating Action Buttons (Active when flipped) */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleRate("again")}
          className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-300 transition-all hover:scale-[1.02]"
        >
          <span className="font-bold text-sm">ทบทวนซ้ำ</span>
          <span className="text-[10px] text-rose-400/80 mt-0.5">พรุ่งนี้ (1 วัน)</span>
        </button>

        <button
          onClick={() => handleRate("good")}
          className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 transition-all hover:scale-[1.02]"
        >
          <span className="font-bold text-sm">จำได้</span>
          <span className="text-[10px] text-blue-400/80 mt-0.5">ขยับกล่องถัดไป</span>
        </button>

        <button
          onClick={() => handleRate("mastered")}
          className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 transition-all hover:scale-[1.02]"
        >
          <span className="font-bold text-sm">แม่นยำแล้ว</span>
          <span className="text-[10px] text-emerald-400/80 mt-0.5">30 วันข้างหน้า</span>
        </button>
      </div>
    </div>
  );
}
