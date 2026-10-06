"use client";

import React, { useState, useEffect, useRef } from "react";
import { WritingPrompt, WritingEvaluation } from "@/types/writing";
import { EDUSYNCH_WRITING_PROMPTS, getRandomWritingPrompt } from "@/lib/writing/prompts";
import {
  PenTool,
  Clock,
  FileText,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export function WritingSandbox() {
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt>(EDUSYNCH_WRITING_PROMPTS[0]);
  const [essay, setEssay] = useState("");
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedModel, setCopiedModel] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const isWordCountPassed = wordCount >= currentPrompt.minWords;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleNextPrompt = () => {
    const next = getRandomWritingPrompt(currentPrompt.id);
    setCurrentPrompt(next);
    setEssay("");
    setTimeLeft(20 * 60);
    setIsTimerRunning(false);
    setEvaluation(null);
    setErrorMsg(null);
  };

  const handleResetTimer = () => {
    setTimeLeft(20 * 60);
    setIsTimerRunning(false);
  };

  const handleSubmitEssay = async () => {
    if (wordCount < 50) {
      setErrorMsg("กรุณาเขียนบทความอย่างน้อย 50 คำขึ้นไปก่อนส่งตรวจ");
      return;
    }

    setIsEvaluating(true);
    setErrorMsg(null);

    try {
      let customApiKey = "";
      let targetLevel = "B2";
      try {
        customApiKey = localStorage.getItem("eng_cefr_gemini_api_key") || "";
        targetLevel = localStorage.getItem("eng_cefr_target_level") || "B2";
      } catch {
        // Fallback
      }

      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt.promptText,
          essay,
          userApiKey: customApiKey || undefined,
          targetLevel,
        }),
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
        setIsTimerRunning(false);
      } else {
        setErrorMsg(data.error || "ไม่สามารถตรวจบทความได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      console.error("[WritingSandbox] Submit error:", err);
      setErrorMsg("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyModelEssay = () => {
    if (!evaluation?.modelEssay) return;
    navigator.clipboard.writeText(evaluation.modelEssay);
    setCopiedModel(true);
    setTimeout(() => setCopiedModel(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Prompt Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
              โจทย์สอบ EduSynch Writing
            </span>
            <span className="text-xs text-slate-500">หมวด: {currentPrompt.category}</span>
          </div>

          <button
            onClick={handleNextPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>สุ่มโจทย์ข้อใหม่</span>
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {currentPrompt.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            {currentPrompt.promptText}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>เวลาสอบจริง: 20 นาที</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>เกณฑ์ขั้นต่ำ: 150 คำ</span>
          </span>
        </div>
      </div>

      {/* Editor & Timer Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          {/* 20-minute countdown timer */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-base font-bold border transition-colors ${
                timeLeft < 180
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                  : "bg-slate-950 border-slate-800 text-white"
              }`}
            >
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title={isTimerRunning ? "พักจับเวลา" : "เริ่มจับเวลา"}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handleResetTimer}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="รีเซ็ตเวลา 20 นาที"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Word Counter with Threshold */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isWordCountPassed
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
            >
              {isWordCountPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{wordCount} คำ (ผ่านเกณฑ์ $\ge$ 150 คำแล้ว!)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>
                    {wordCount} / 150 คำ (ต้องการอีก {150 - wordCount} คำ)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="เริ่มพิมพ์บทความของคุณที่นี่ (แนะนำโครงสร้าง: คำนำ 1 ย่อหน้า, เนื้อหาพร้อมยกตัวอย่าง 2 ย่อหน้า, และบทสรุป 1 ย่อหน้า)..."
            rows={14}
            className="w-full p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-all font-sans text-base leading-relaxed resize-y"
          />
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            ระบบจะส่ง Essay ให้ Gemini AI วิเคราะห์คะแนนเทียบเคียงเกณฑ์ ก.ค.ศ. และชี้จุดปรับปรุง
          </p>

          <button
            onClick={handleSubmitEssay}
            disabled={isEvaluating || essay.trim().length === 0}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all ${
              isEvaluating || essay.trim().length === 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-violet-500/25 hover:scale-[1.02]"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isEvaluating ? "animate-spin" : ""}`} />
            <span>{isEvaluating ? "กำลังตรวจวิเคราะห์ผลงาน..." : "ส่งตรวจบทความด้วย AI"}</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results Section */}
      {evaluation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-8 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-violet-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                ผลการประเมิน CEFR สำหรับวิทยฐานะ
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                {evaluation.estimatedScoreDesc}
              </h3>
              <p className="text-xs text-slate-400">
                ความยาวบทความที่ส่ง: {evaluation.wordCount} คำ
              </p>
            </div>

            <div className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xl shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                CEFR LEVEL
              </span>
              <span className="text-4xl font-black">{evaluation.overallCefrLevel}</span>
            </div>
          </div>

          {/* 4 Rubric Breakdown Cards */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              <span>การประเมินแยก 4 ด้าน (Core Rubrics)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { title: "Task Achievement (การตอบตรงโจทย์)", data: evaluation.rubrics.taskAchievement },
                { title: "Coherence & Cohesion (ความต่อเนื่องและคำเชื่อม)", data: evaluation.rubrics.coherenceCohesion },
                { title: "Lexical Resource (ความหลากหลายของคำศัพท์)", data: evaluation.rubrics.lexicalResource },
                { title: "Grammatical Accuracy (ความถูกต้องของไวยากรณ์)", data: evaluation.rubrics.grammaticalAccuracy },
              ].map((r, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">{r.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      CEFR {r.data.cefr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.data.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Corrections */}
          {evaluation.corrections && evaluation.corrections.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>จุดที่ควรแก้ไขทางไวยากรณ์ (Grammar Corrections)</span>
              </h4>

              <div className="space-y-2.5">
                {evaluation.corrections.map((corr, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="line-through text-rose-400/90 font-mono bg-rose-500/10 px-2 py-0.5 rounded">
                        {corr.original}
                      </span>
                      <span className="text-slate-500">➔</span>
                      <span className="text-emerald-300 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                        {corr.corrected}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{corr.explanationTh}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vocabulary Upgrades */}
          {evaluation.vocabUpgrades && evaluation.vocabUpgrades.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>คำศัพท์ที่สามารถอัปเกรดเป็นระดับสูง (Vocabulary Upgrades)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evaluation.vocabUpgrades.map((upg, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">เดิม: {upg.originalWord}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        CEFR {upg.cefrLevel}
                      </span>
                    </div>
                    <p className="text-amber-300 font-semibold text-sm">➔ {upg.suggestedUpgrade}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{upg.reasonTh}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model Essay Section */}
          {evaluation.modelEssay && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>ตัวอย่างบทความระดับมาตรฐาน (Model Essay)</span>
                </h4>

                <button
                  onClick={handleCopyModelEssay}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  {copiedModel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedModel ? "คัดลอกแล้ว" : "คัดลอกเนื้อหา"}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-line italic">
                {evaluation.modelEssay}
              </div>
            </div>
          )}

          {/* Encouraging Summary */}
          {evaluation.summaryFeedbackTh && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
              <strong className="block font-semibold mb-0.5">คำแนะนำจาก AI:</strong>
              {evaluation.summaryFeedbackTh}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
