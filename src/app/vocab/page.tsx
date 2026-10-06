import React from "react";
import { BookOpenCheck, Plus, Sparkles, Filter } from "lucide-react";

export default function VocabPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpenCheck className="w-6 h-6 text-indigo-400" />
            <span>คลังคำศัพท์และระบบทบทวน (Vocabulary Bank & SRS)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            คำศัพท์ที่บันทึกจากการอ่านข่าวและการฝึกทำข้อสอบ พร้อมระบบทบทวนความจำระยะยาว (Spaced Repetition)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium text-sm shadow-md hover:from-indigo-500 hover:to-blue-500 transition-all">
            <Sparkles className="w-4 h-4" />
            <span>เริ่มทบทวน Flashcards</span>
          </button>
        </div>
      </div>

      {/* Placeholder / Empty State */}
      <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
          <BookOpenCheck className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg text-white">คลังคำศัพท์กำลังรอคุณอยู่</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">
          เมื่อคุณอ่านข่าวประจำวัน คุณสามารถคลิกที่คำศัพท์ใดก็ได้เพื่อดูคำแปล และกดบันทึกลงคลังคำศัพท์นี้ได้ทันที
        </p>
      </div>
    </div>
  );
}
