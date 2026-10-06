"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2, Gauge, AlertCircle } from "lucide-react";

interface AudioPlayerProps {
  paragraphs: string[];
  onParagraphChange?: (index: number) => void;
}

export function AudioPlayer({ paragraphs, onParagraphChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(-1);
  const [supported, setSupported] = useState<boolean>(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeIndexRef = useRef<number>(-1);
  const rateRef = useRef<number>(playbackRate);
  rateRef.current = playbackRate;

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakParagraph = (index: number) => {
    if (index >= paragraphs.length) {
      // Completed reading all paragraphs
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentParagraphIndex(-1);
      onParagraphChange?.(-1);
      return;
    }

    activeIndexRef.current = index;
    setCurrentParagraphIndex(index);
    onParagraphChange?.(index);

    const utterance = new SpeechSynthesisUtterance(paragraphs[index]);
    utteranceRef.current = utterance;
    utterance.rate = rateRef.current;
    utterance.lang = "en-US";

    // Try finding natural English voice
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find((v) => v.lang === "en-US" && !v.name.includes("whisper")) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onend = () => {
      // Move to next paragraph
      speakParagraph(index + 1);
    };

    utterance.onerror = (e) => {
      // Ignore interrupted errors on manual stop
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("[SpeechSynthesis] Error:", e);
      }
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentParagraphIndex(-1);
      onParagraphChange?.(-1);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!supported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);
    setIsPaused(false);
    speakParagraph(0);
  };

  const handlePause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentParagraphIndex(-1);
    onParagraphChange?.(-1);
  };

  const handleChangeRate = (rate: number) => {
    setPlaybackRate(rate);
    rateRef.current = rate;
    // If currently playing, restart from current paragraph at new rate
    if (isPlaying && currentParagraphIndex >= 0) {
      window.speechSynthesis.cancel();
      speakParagraph(currentParagraphIndex);
    }
  };

  if (!supported) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>เบราว์เซอร์ของคุณยังไม่รองรับระบบสังเคราะห์เสียง (Web Speech API)</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-semibold text-white block">เสียงอ่านบทความ</span>
          <span className="text-[11px] text-slate-400">
            {isPlaying
              ? `กำลังอ่านย่อหน้าที่ ${currentParagraphIndex + 1}/${paragraphs.length}`
              : isPaused
              ? "หยุดชั่วคราว"
              : "กดเล่นเพื่อฝึกฟังไปพร้อมกับอ่าน"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Play / Pause / Stop buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
              title="เริ่มฟังเสียงอ่าน"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isPaused ? "เล่นต่อ" : "เริ่มฟัง"}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
              title="หยุดชั่วคราว"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>พัก</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isPlaying || isPaused
                ? "text-slate-400 hover:text-white hover:bg-slate-900"
                : "text-slate-600 cursor-not-allowed"
            }`}
            title="หยุดและเริ่มใหม่"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Playback Speed selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <Gauge className="w-3 h-3 text-slate-500 ml-1.5 hidden sm:block" />
          {[0.8, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              onClick={() => handleChangeRate(rate)}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                playbackRate === rate
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
