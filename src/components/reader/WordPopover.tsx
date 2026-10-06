"use client";

import React, { useState, useEffect } from "react";
import { TargetVocabulary } from "@/types/news";
import { saveVocabItem, isWordSaved } from "@/lib/storage/vocabStorage";
import { Volume2, Bookmark, Check, X, Sparkles, BookOpen, Loader2 } from "lucide-react";

interface WordPopoverProps {
  word: string;
  matchedVocab?: TargetVocabulary;
  sourceArticleTitle?: string;
  onClose: () => void;
}

export function WordPopover({
  word,
  matchedVocab,
  sourceArticleTitle,
  onClose,
}: WordPopoverProps) {
  const [vocabData, setVocabData] = useState<TargetVocabulary | undefined>(matchedVocab);
  const [isLoadingLookup, setIsLoadingLookup] = useState<boolean>(!matchedVocab);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isWordSaved(word));

    if (matchedVocab) {
      setVocabData(matchedVocab);
      setIsLoadingLookup(false);
    } else {
      // Dynamic lookup for any clicked word!
      setIsLoadingLookup(true);
      let userKey = "";
      try {
        userKey = localStorage.getItem("eng_cefr_gemini_api_key") || "";
      } catch {
        // Fallback
      }

      fetch("/api/lookup-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
          userApiKey: userKey || undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.vocab) {
            setVocabData(data.vocab);
          }
        })
        .catch((err) => console.warn("[Lookup Error]:", err))
        .finally(() => setIsLoadingLookup(false));
    }
  }, [word, matchedVocab]);

  const handleSpeak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = () => {
    if (!vocabData) return;
    saveVocabItem(vocabData, sourceArticleTitle);
    setSaved(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 pb-safe animate-slideUp sm:animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-2xl font-bold text-white capitalize">{word}</h3>
            <button
              onClick={handleSpeak}
              className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-white transition-colors"
              title="ฟังเสียงการออกเสียง"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {vocabData?.cefrLevel && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                CEFR {vocabData.cefrLevel}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Phonetic & Part of speech */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          {vocabData?.phonetic && <span>{vocabData.phonetic}</span>}
          {vocabData?.partOfSpeech && (
            <span className="italic px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {vocabData.partOfSpeech}
            </span>
          )}
        </div>

        {/* Definitions & Translation */}
        {isLoadingLookup ? (
          <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-2.5 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>กำลังค้นหาคำแปลภาษาไทย...</span>
          </div>
        ) : vocabData ? (
          <div className="space-y-2.5 text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider block">
                ความหมายภาษาไทย
              </span>
              <p className="text-slate-100 font-bold text-base">{vocabData.definitionTh}</p>
            </div>

            {vocabData.definitionEn && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                  English Definition
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {vocabData.definitionEn}
                </p>
              </div>
            )}

            {vocabData.exampleSentence && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                  ตัวอย่างประโยค
                </span>
                <p className="text-slate-300 text-xs italic leading-relaxed">
                  &ldquo;{vocabData.exampleSentence}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-400 font-medium">
              <BookOpen className="w-4 h-4" />
              <span>คำศัพท์ในบทความ</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              สามารถบันทึกคำนี้ลงคลังคำศัพท์ (Vocabulary Bank) เพื่อนำไปทบทวนได้ทันที
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saved || isLoadingLookup}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.01]"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>บันทึกลงคลังคำศัพท์แล้ว</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>บันทึกลงคลังคำศัพท์ (Vocabulary Bank)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
