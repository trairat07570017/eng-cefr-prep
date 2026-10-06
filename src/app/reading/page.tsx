import React from "react";
import { BookMarked, Timer, CheckCircle2 } from "lucide-react";

export default function ReadingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-teal-400" />
            <span>ฝึกการอ่านจับใจความ (Reading Practice)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            แบบฝึกหัดอ่านบทความทางวิชาการและสังคม พร้อมตอบคำถามปรนัยจับใจความ ตีความ และคำศัพท์ในบริบท
          </p>
        </div>
      </div>

      <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
          <BookMarked className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg text-white">คลังข้อสอบการอ่าน</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">
          เตรียมพบกับบทความตามโครงสร้าง EduSynch Reading 40 นาที จับเวลาและตรวจคะแนนอัตโนมัติ
        </p>
      </div>
    </div>
  );
}
