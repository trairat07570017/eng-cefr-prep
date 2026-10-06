import React from "react";
import { PenTool, Clock, Award, FileText } from "lucide-react";

export default function WritingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <PenTool className="w-6 h-6 text-violet-400" />
            <span>ห้องฝึกเขียน Essay (EduSynch Writing Sandbox)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            จำลองสถานการณ์สอบจริง: เวลา 20 นาที พิมพ์บทความไม่ต่ำกว่า 150 คำ ตรวจวิเคราะห์ด้วย Gemini AI ตามกรอบ CEFR
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">เวลาจำลอง</span>
            <p className="text-base font-bold text-white">20 นาที นับถอยหลัง</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">เกณฑ์จำนวนคำ</span>
            <p className="text-base font-bold text-white">อย่างน้อย 150 คำ</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">การตรวจประเมิน</span>
            <p className="text-base font-bold text-white">CEFR Rubric โดย AI</p>
          </div>
        </div>
      </div>

      <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
          <PenTool className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg text-white">ระบบจำลองการเขียนกำลังจะเปิดให้ใช้งานในตั๋ว 006</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">
          เตรียมตัวทดสอบเขียนบทความจริง พร้อมระบบตรวจคะแนนไวยากรณ์และชี้แนะคำศัพท์ระดับสูงอัตโนมัติ
        </p>
      </div>
    </div>
  );
}
