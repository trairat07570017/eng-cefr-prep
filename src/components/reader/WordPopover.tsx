"use client";

import React, { useState, useEffect } from "react";
import { TargetVocabulary } from "@/types/news";
import { saveVocabItem, isWordSaved } from "@/lib/storage/vocabStorage";
import { Volume2, Bookmark, Check, X, Sparkles, BookOpen } from "lucide-react";

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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isWordSaved(word));
  }, [word]);

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
    const vocabToSave: TargetVocabulary = matchedVocab || {
      word: word.toLowerCase(),
      partOfSpeech: "vocabulary",
      definitionTh: "คำศัพท์จากบทความประจำวัน (กดทบทวนเพื่อเรียนรู้เพิ่มเติม)",
      definitionEn: "Word encountered in daily reading article",
      exampleSentence: `Extracted from: ${sourceArticleTitle || "Daily Article"}`,
      cefrLevel: "B2",
    };

    saveVocabItem(vocabToSave, sourceArticleTitle);
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
            {matchedVocab?.cefrLevel && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                CEFR {matchedVocab.cefrLevel}
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
          {matchedVocab?.phonetic && <span>{matchedVocab.phonetic}</span>}
          {matchedVocab?.partOfSpeech && (
            <span className="italic px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {matchedVocab.partOfSpeech}
            </span>
          )}
        </div>

        {/* Definitions */}
        {matchedVocab ? (
          <div className="space-y-2.5 text-sm">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-blue-400 font-semibold block mb-0.5">
                ความหมาย (ภาษาไทย)
              </span>
              <p className="text-slate-200 font-medium">{matchedVocab.definitionTh}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block mb-0.5">
                English Definition
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {matchedVocab.definitionEn}
              </p>
            </div>

            {matchedVocab.exampleSentence && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block mb-0.5">
                  ตัวอย่างประโยคในบริบท
                </span>
                <p className="text-slate-300 text-xs italic leading-relaxed">
                  &ldquo;{matchedVocab.exampleSentence}&rdquo;
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
              คำนี้สามารถบันทึกลงคลังคำศัพท์ (Vocabulary Bank) เพื่อนำไปทบทวนในระบบ Flashcards ของคุณได้ทันที
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saved}
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
