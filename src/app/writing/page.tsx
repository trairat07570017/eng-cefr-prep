import React from "react";
import { WritingSandbox } from "@/components/writing/WritingSandbox";
import { PenTool } from "lucide-react";

export default function WritingPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <PenTool className="w-6 h-6 text-violet-400" />
          <span>ห้องฝึกเขียน Essay (EduSynch Writing Sandbox)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          จำลองเวลาสอบจริง 20 นาที พิมพ์บทความไม่ต่ำกว่า 150 คำ ตรวจวิเคราะห์ด้วย Gemini AI พร้อมประเมินเกณฑ์ ก.ค.ศ.
        </p>
      </div>

      <WritingSandbox />
    </div>
  );
}
