"use client";

import React, { useState } from "react";
import { ComprehensionQuestion } from "@/types/news";
import { CheckCircle2, XCircle, HelpCircle, Award, RefreshCw } from "lucide-react";

interface ComprehensionQuizProps {
  questions: ComprehensionQuestion[];
}

export function ComprehensionQuiz({ questions }: ComprehensionQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) return null;

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults) return; // Prevent changing after submit
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const allAnswered = questions.every((_, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              วัดความเข้าใจจากการอ่าน (Comprehension Check)
            </h3>
            <p className="text-xs text-slate-400">
              ทดสอบจับใจความสำคัญและรายละเอียดตามมาตรฐานข้อสอบ CEFR
            </p>
          </div>
        </div>

        {showResults && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Award className="w-4 h-4" />
            <span>
              คะแนน: {calculateScore()}/{questions.length}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selected = selectedAnswers[qIndex];
          const isCorrect = selected === q.correctAnswer;

          return (
            <div key={qIndex} className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 leading-snug">
                {qIndex + 1}. {q.question}
              </h4>

              <div className="space-y-2">
                {q.options.map((option, optIndex) => {
                  const isThisSelected = selected === optIndex;
                  const isThisCorrect = optIndex === q.correctAnswer;

                  let optionStyle =
                    "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950";

                  if (isThisSelected && !showResults) {
                    optionStyle = "bg-blue-600/15 border-blue-500/60 text-white font-medium";
                  }

                  if (showResults) {
                    if (isThisCorrect) {
                      optionStyle = "bg-emerald-500/15 border-emerald-500/60 text-emerald-200 font-medium";
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = "bg-rose-500/15 border-rose-500/60 text-rose-200 line-through opacity-80";
                    } else {
                      optionStyle = "bg-slate-950/40 border-slate-900 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelect(qIndex, optIndex)}
                      className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {showResults && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {showResults && isThisSelected && !isThisCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation in Thai when results revealed */}
              {showResults && (
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  }`}
                >
                  <strong className="block font-semibold mb-0.5">
                    {isCorrect ? "คำตอบถูกต้อง!" : "คำอธิบายเฉลย:"}
                  </strong>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex justify-end">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={!allAnswered}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              allAnswered
                ? "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white shadow-lg shadow-teal-500/20 hover:scale-[1.02]"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            ตรวจคำตอบ
          </button>
        ) : (
          <button
            onClick={() => {
              setSelectedAnswers({});
              setShowResults(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ทำใหม่อีกครั้ง</span>
          </button>
        )}
      </div>
    </div>
  );
}
