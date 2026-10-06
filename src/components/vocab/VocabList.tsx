"use client";

import React, { useState } from "react";
import { StoredVocabularyItem, removeVocabItem, seedStarterVocab } from "@/lib/storage/vocabStorage";
import {
  Search,
  Volume2,
  Trash2,
  Sparkles,
  Layers,
  Calendar,
  BookOpen,
  Filter,
} from "lucide-react";

interface VocabListProps {
  items: StoredVocabularyItem[];
  onRefresh: () => void;
  onStartReview: (filteredItems: StoredVocabularyItem[]) => void;
}

export function VocabList({ items, onRefresh, onStartReview }: VocabListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "due" | "B1" | "B2" | "C1">("all");

  const today = new Date().toISOString().split("T")[0];

  const handleSpeak = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("คุณต้องการลบคำศัพท์นี้ออกจากคลังหรือไม่?")) {
      removeVocabItem(id);
      onRefresh();
    }
  };

  const handleSeed = () => {
    const added = seedStarterVocab();
    alert(`เพิ่มชุดคำศัพท์เริ่มต้นเรียบร้อยแล้ว (${added} คำใหม่)`);
    onRefresh();
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definitionTh.includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedFilter === "due") {
      return item.nextReviewDate <= today;
    }
    if (selectedFilter === "B1" || selectedFilter === "B2" || selectedFilter === "C1") {
      return item.cefrLevel === selectedFilter;
    }
    return true;
  });

  const dueCount = items.filter((item) => item.nextReviewDate <= today).length;

  return (
    <div className="space-y-6">
      {/* Search Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาคำศัพท์ หรือความหมายภาษาไทย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {(
            [
              { id: "all", label: `ทั้งหมด (${items.length})` },
              { id: "due", label: `ถึงกำหนดทบทวน (${dueCount})` },
              { id: "B1", label: "B1" },
              { id: "B2", label: "B2" },
              { id: "C1", label: "C1" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {searchQuery ? "ไม่พบคำศัพท์ที่ตรงกับการค้นหา" : "ยังไม่มีคำศัพท์ในหมวดนี้"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            คุณสามารถเพิ่มคำศัพท์ได้โดยการคลิกที่คำในบทความข่าวประจำวัน หรือกดเพิ่มชุดคำศัพท์เริ่มต้นสำหรับสอบ EduSynch ด้านล่าง
          </p>
          <button
            onClick={handleSeed}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold shadow-md hover:scale-[1.02] transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>เพิ่มคำศัพท์เริ่มต้น (EduSynch Core Pack)</span>
          </button>
        </div>
      ) : (
        /* Grid of Vocab Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const isDue = item.nextReviewDate <= today;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-white capitalize">{item.word}</h3>
                    <button
                      onClick={(e) => handleSpeak(item.word, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                      title="ฟังเสียงอ่าน"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      CEFR {item.cefrLevel}
                    </span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="ลบคำศัพท์"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {item.phonetic} • <span className="italic">{item.partOfSpeech}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">{item.definitionTh}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.definitionEn}
                  </p>
                </div>

                {item.exampleSentence && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    &ldquo;{item.exampleSentence}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>กล่อง SRS: {item.reviewStage}/5</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={isDue ? "text-amber-400 font-medium" : ""}>
                      {isDue ? "ถึงเวลาทบทวนวันนี้" : `รอบถัดไป: ${item.nextReviewDate}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
