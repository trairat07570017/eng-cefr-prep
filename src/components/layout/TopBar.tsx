"use client";

import React, { useEffect, useState } from "react";
import { Flame, Target, Database } from "lucide-react";

export function TopBar() {
  const [currentDate, setCurrentDate] = useState("");
  const [streak, setStreak] = useState(1);
  const [targetLevel, setTargetLevel] = useState("B2");
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  useEffect(() => {
    // Format date in Thai / English
    const now = new Date();
    const formatted = now.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formatted);

    // Read stored preferences from localStorage if present
    try {
      const storedStreak = localStorage.getItem("eng_cefr_streak");
      if (storedStreak) setStreak(parseInt(storedStreak, 10));

      const storedTarget = localStorage.getItem("eng_cefr_target_level");
      if (storedTarget) setTargetLevel(storedTarget);

      const hasSupabase = localStorage.getItem("eng_cefr_supabase_url");
      setIsCloudSynced(!!hasSupabase);
    } catch {
      // LocalStorage fallback
    }
  }, []);

  return (
    <header className="hidden md:flex items-center justify-between px-6 h-16 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span className="font-medium text-slate-300">{currentDate}</span>
        <span className="text-slate-600">•</span>
        <span className="text-xs text-slate-500">แผนเตรียมตัว 1 ปี สู่ B2/C1</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Sync Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isCloudSynced
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-slate-800 text-slate-400 border-slate-700"
          }`}
          title={isCloudSynced ? "เชื่อมต่อ Supabase แล้ว" : "บันทึกในเครื่อง (Local Storage)"}
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isCloudSynced ? "Cloud Synced" : "Local Storage"}</span>
        </div>

        {/* Target Level Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Target className="w-3.5 h-3.5" />
          <span>เป้าหมาย: CEFR {targetLevel}</span>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span>{streak} วันต่อเนื่อง</span>
        </div>
      </div>
    </header>
  );
}
