import React from "react";
import Link from "next/link";
import {
  Newspaper,
  BookOpenCheck,
  PenTool,
  BookMarked,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Calendar,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>เส้นทาง 1 ปี สู่การลดระยะเวลาวิทยฐานะ ว.PA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            พัฒนาภาษาอังกฤษทุกวัน ก้าวสู่เกณฑ์{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
              CEFR B2 / C1
            </span>
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            อ่านข่าวจริงที่ Gemini ย่อยให้ตรงระดับคำศัพท์ B1–B2 สะสมคำศัพท์ลงคลัง
            และฝึกทำข้อสอบจำลอง EduSynch 4 ทักษะเพื่อพิชิตคะแนนตามเกณฑ์ ก.ค.ศ.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
            >
              <Newspaper className="w-4 h-4" />
              <span>อ่านข่าวประจำวันนี้</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 font-medium text-sm hover:bg-slate-800 transition-all"
            >
              <PenTool className="w-4 h-4 text-blue-400" />
              <span>ฝึกเขียน Essay (EduSynch)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Core Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Daily Reading */}
        <Link
          href="/"
          className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Newspaper className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors">
              Daily Article Reader
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              ข่าวคัดสรร 1-2 เรื่องต่อวัน ปรับระดับ CEFR พร้อมแตะดูคำแปลและฟังเสียงอ่าน
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-blue-400 font-medium">
            <span>เข้าสู่การอ่าน</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Vocabulary Bank */}
        <Link
          href="/vocab"
          className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base group-hover:text-indigo-400 transition-colors">
              Vocabulary Bank & SRS
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              คลังคำศัพท์ที่บันทึกไว้ พร้อมระบบ Flashcards ทบทวนตามระยะเวลาจำฝังแน่น
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>ทบทวนคำศัพท์</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: EduSynch Writing Sandbox */}
        <Link
          href="/writing"
          className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-violet-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base group-hover:text-violet-400 transition-colors">
              Writing Sandbox
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              จำลองสอบเขียน 20 นาที 150 คำ ตรวจด้วย AI ให้คะแนนตามเกณฑ์ CEFR ทันที
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-violet-400 font-medium">
            <span>เริ่มเขียนบทความ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Accreditation Reduction Info Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">
              เกณฑ์ ก.ค.ศ. ลดระยะเวลาการดำรงตำแหน่ง/วิทยฐานะ (4 ปี เหลือ 3 ปี)
            </h4>
            <p className="text-slate-400 text-xs mt-0.5">
              ครูผู้สอนทั่วไป: ต้องได้ผลสอบ <strong className="text-amber-300">สูงกว่าระดับ B1 (คือ B2 ขึ้นไป)</strong> |
              ครูภาษาอังกฤษ: ต้องได้ <strong className="text-amber-300">สูงกว่าระดับ B2 (คือ C1 ขึ้นไป)</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>ผลสอบมีอายุ 2 ปี</span>
        </div>
      </div>
    </div>
  );
}
