"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  StoredVocabularyItem,
  getSavedVocabItems,
  getDueVocabItems,
  seedStarterVocab,
} from "@/lib/storage/vocabStorage";
import { VocabList } from "@/components/vocab/VocabList";
import { FlashcardReview } from "@/components/vocab/FlashcardReview";
import {
  BookOpenCheck,
  Sparkles,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function VocabPage() {
  const [items, setItems] = useState<StoredVocabularyItem[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewItems, setReviewItems] = useState<StoredVocabularyItem[]>([]);

  const loadItems = useCallback(() => {
    const saved = getSavedVocabItems();
    setItems(saved);
  }, []);

  useEffect(() => {
    loadItems();

    const handleUpdate = () => loadItems();
    window.addEventListener("vocabBankUpdated", handleUpdate);
    return () => window.removeEventListener("vocabBankUpdated", handleUpdate);
  }, [loadItems]);

  const dueItems = getDueVocabItems();
  const masteredItems = items.filter((i) => i.reviewStage === 5);

  const startReview = (targetList?: StoredVocabularyItem[]) => {
    const listToReview = targetList || (dueItems.length > 0 ? dueItems : items);
    setReviewItems(listToReview);
    setReviewMode(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpenCheck className="w-6 h-6 text-indigo-400" />
            <span>คลังคำศัพท์และระบบทบทวน (Vocabulary Bank & SRS)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            เทคนิค Spaced Repetition (SRS Leitner) ช่วยให้จำศัพท์ EduSynch B2/C1 ได้แม่นยำตลอด 1 ปี
          </p>
        </div>

        {!reviewMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => startReview(dueItems.length > 0 ? dueItems : items)}
              disabled={items.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                items.length > 0
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02]"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {dueItems.length > 0
                  ? `เริ่มทบทวน (${dueItems.length} คำ)`
                  : "ทบทวนคำศัพท์ทั้งหมด"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Top 3 Stat Cards (only when not in review mode) */}
      {!reviewMode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">คำศัพท์ในคลัง</span>
              <p className="text-xl font-extrabold text-white">{items.length} คำ</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">ถึงกำหนดทบทวนวันนี้</span>
              <p className="text-xl font-extrabold text-white">
                {dueItems.length} <span className="text-xs font-normal text-slate-400">คำ</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">จำฝังแน่น (Mastered)</span>
              <p className="text-xl font-extrabold text-white">
                {masteredItems.length} <span className="text-xs font-normal text-slate-400">คำ</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main View: Review Mode vs Vocab List */}
      {reviewMode ? (
        <FlashcardReview
          items={reviewItems}
          onExit={() => {
            setReviewMode(false);
            loadItems();
          }}
        />
      ) : (
        <VocabList
          items={items}
          onRefresh={loadItems}
          onStartReview={startReview}
        />
      )}
    </div>
  );
}
