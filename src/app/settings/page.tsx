"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  Key,
  Database,
  Target,
  Save,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  Smartphone,
  Share,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  Radio,
} from "lucide-react";
import { getSavedVocabItems } from "@/lib/storage/vocabStorage";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [targetLevel, setTargetLevel] = useState("B2");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Connection testing states
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestStatus, setGeminiTestStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("eng_cefr_gemini_api_key") || "";
      const storedTarget = localStorage.getItem("eng_cefr_target_level") || "B2";
      const storedSbUrl = localStorage.getItem("eng_cefr_supabase_url") || "";
      const storedSbKey = localStorage.getItem("eng_cefr_supabase_key") || "";

      setApiKey(storedKey);
      setTargetLevel(storedTarget);
      setSupabaseUrl(storedSbUrl);
      setSupabaseKey(storedSbKey);
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      localStorage.setItem("eng_cefr_gemini_api_key", apiKey.trim());
      localStorage.setItem("eng_cefr_target_level", targetLevel);
      localStorage.setItem("eng_cefr_supabase_url", supabaseUrl.trim());
      localStorage.setItem("eng_cefr_supabase_key", supabaseKey.trim());

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      window.dispatchEvent(new Event("storage"));
    } catch {
      alert("ไม่สามารถบันทึกลง LocalStorage ได้");
    }
  };

  const handleTestGemini = async () => {
    setIsTestingGemini(true);
    setGeminiTestStatus(null);
    try {
      const res = await fetch("/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setGeminiTestStatus({ success: true, msg: "เชื่อมต่อกับ Gemini API สำเร็จสมบูรณ์!" });
      } else {
        setGeminiTestStatus({ success: false, msg: data.error || "เชื่อมต่อไม่สำเร็จ" });
      }
    } catch (err) {
      setGeminiTestStatus({ success: false, msg: "ไม่สามารถส่งคำขอทดสอบได้" });
    } finally {
      setIsTestingGemini(false);
    }
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setSupabaseTestStatus({ success: false, msg: "กรุณาระบุ URL และ Anon Key ให้ครบถ้วน" });
      return;
    }

    setIsTestingSupabase(true);
    setSupabaseTestStatus(null);
    try {
      const url = supabaseUrl.replace(/\/$/, "");
      const res = await fetch(`${url}/rest/v1/`, {
        headers: {
          apikey: supabaseKey.trim(),
          Authorization: `Bearer ${supabaseKey.trim()}`,
        },
      });

      if (res.ok || res.status === 200 || res.status === 404) {
        setSupabaseTestStatus({ success: true, msg: "เชื่อมต่อกับ Supabase Endpoint สำเร็จแล้ว!" });
      } else {
        setSupabaseTestStatus({ success: false, msg: `ตอบกลับด้วยรหัส HTTP ${res.status}` });
      }
    } catch (err) {
      setSupabaseTestStatus({ success: false, msg: "ไม่สามารถเชื่อมต่อ Supabase URL ได้ กรุณาตรวจสอบ URL" });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleExportData = () => {
    try {
      const vocabItems = getSavedVocabItems();
      const backupData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        targetLevel,
        streak: localStorage.getItem("eng_cefr_streak") || "1",
        vocabularyCount: vocabItems.length,
        vocabularyBank: vocabItems,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `eng-cefr-backup-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (parsed.vocabularyBank && Array.isArray(parsed.vocabularyBank)) {
          localStorage.setItem("eng_cefr_vocab_bank", JSON.stringify(parsed.vocabularyBank));
          if (parsed.streak) localStorage.setItem("eng_cefr_streak", String(parsed.streak));
          if (parsed.targetLevel) localStorage.setItem("eng_cefr_target_level", parsed.targetLevel);

          window.dispatchEvent(new Event("vocabBankUpdated"));
          window.dispatchEvent(new Event("storage"));
          alert(`นำเข้าข้อมูลสำเร็จ! พบคำศัพท์ทั้งหมด ${parsed.vocabularyBank.length} คำ`);
        } else {
          alert("รูปแบบไฟล์สำรองไม่ถูกต้อง");
        }
      } catch {
        alert("ไม่สามารถอ่านไฟล์ JSON ได้");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8 max-w-3xl animate-fadeIn">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-400" />
          <span>ตั้งค่าและเชื่อมต่อ (Settings & Sync)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          ปรับแต่งระดับเป้าหมาย CEFR จัดการคีย์ Gemini AI และตั้งค่าการซิงค์ข้อมูลข้ามอุปกรณ์
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Target Level Setting */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-base font-semibold text-white">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>ระดับเป้าหมาย CEFR ตามเกณฑ์ ก.ค.ศ.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <label
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                targetLevel === "B2"
                  ? "bg-blue-600/15 border-blue-500/60 text-white shadow-sm"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="targetLevel"
                value="B2"
                checked={targetLevel === "B2"}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="mt-1"
              />
              <div className="space-y-1">
                <span className="font-bold text-sm block text-white">
                  ระดับ B2 (สำหรับครูทั่วไป)
                </span>
                <span className="text-xs text-slate-400 leading-relaxed block">
                  เกณฑ์ ก.ค.ศ. ระบุ &ldquo;สูงกว่า B1&rdquo; ใช้ลดระยะเวลาทำวิทยฐานะ 4 ปี เหลือ 3 ปี
                  สำหรับครูทุกกลุ่มสาระที่ไม่ใช่วิชาภาษาต่างประเทศ
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                targetLevel === "C1"
                  ? "bg-blue-600/15 border-blue-500/60 text-white shadow-sm"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="targetLevel"
                value="C1"
                checked={targetLevel === "C1"}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="mt-1"
              />
              <div className="space-y-1">
                <span className="font-bold text-sm block text-white">
                  ระดับ C1 (สำหรับครูภาษาอังกฤษ)
                </span>
                <span className="text-xs text-slate-400 leading-relaxed block">
                  เกณฑ์ ก.ค.ศ. ระบุ &ldquo;สูงกว่า B2&rdquo; ใช้ลดระยะเวลาทำวิทยฐานะ 4 ปี เหลือ 3 ปี
                  สำหรับครูผู้สอนกลุ่มสาระการเรียนรู้ภาษาต่างประเทศ
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Gemini API Key */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-base font-semibold text-white">
              <Key className="w-5 h-5 text-amber-400" />
              <span>Gemini API Key (กำหนดเองได้)</span>
            </div>

            <button
              type="button"
              onClick={handleTestGemini}
              disabled={isTestingGemini}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
            >
              {isTestingGemini ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{isTestingGemini ? "กำลังทดสอบ..." : "ทดสอบการเชื่อมต่อ API"}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            ระบบสามารถใช้ API Key ที่ตั้งไว้ใน Server (Environment Variable) ได้โดยตรง หรือหากต้องการใช้
            Key ส่วนตัวของคุณ สามารถรับได้ฟรีจาก{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
            >
              Google AI Studio
            </a>
          </p>

          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {geminiTestStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                geminiTestStatus.success
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              {geminiTestStatus.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{geminiTestStatus.msg}</span>
            </div>
          )}
        </div>

        {/* 3. Supabase Cloud Sync */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-base font-semibold text-white">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>ซิงค์ข้ามอุปกรณ์ด้วย Supabase Cloud (ไม่บังคับ)</span>
            </div>

            <button
              type="button"
              onClick={handleTestSupabase}
              disabled={isTestingSupabase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
            >
              {isTestingSupabase ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <Database className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isTestingSupabase ? "กำลังทดสอบ..." : "ทดสอบการเชื่อมต่อ"}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            หากต้องการให้ข้อมูลคำศัพท์ซิงค์ตรงกันระหว่าง iPhone, iPad และ PC สมัครโครงการฟรีที่{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              supabase.com
            </a>{" "}
            แล้วนำ Project URL และ Anon Key มาวางที่นี่
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Anon Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOi..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>
          </div>

          {supabaseTestStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                supabaseTestStatus.success
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              {supabaseTestStatus.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{supabaseTestStatus.msg}</span>
            </div>
          )}
        </div>

        {/* 4. Backup & Data Portability */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-base font-semibold text-white">
            <Download className="w-5 h-5 text-teal-400" />
            <span>สำรองและกู้คืนข้อมูล (Backup & Restore)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            ส่งออกคลังคำศัพท์และสถิติการเรียนรู้ของคุณเป็นไฟล์ JSON เพื่อนำไปเปิดในเครื่องอื่น หรือสำรองข้อมูลไว้เพื่อความปลอดภัย
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>ส่งออกข้อมูลสำรอง (Export JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>นำเข้าข้อมูลสำรอง (Import JSON)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </div>
        </div>

        {/* 5. iOS Safari / PWA Installation Guide */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 space-y-3">
          <div className="flex items-center gap-2.5 text-base font-semibold text-white">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span>คำแนะนำการใช้งานบน iPhone & iPad (Safari PWA)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            เพื่อให้ได้ประสบการณ์แบบแอปพลิเคชันเต็มหน้าจอ ไร้แถบ URL bar ของ Safari:
          </p>
          <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed pl-1">
            <li>เปิดเว็บไซต์นี้บนเบราว์เซอร์ **Safari** บน iPhone หรือ iPad</li>
            <li>
              แตะปุ่ม **แชร์ (Share)** <Share className="w-3.5 h-3.5 inline mx-1 text-blue-400" /> ที่แถบด้านล่างของ Safari
            </li>
            <li>เลื่อนลงมาแล้วเลือก **&ldquo;เพิ่มไปยังหน้าจอโฮม&rdquo; (Add to Home Screen)**</li>
            <li>กด **&ldquo;เพิ่ม&rdquo; (Add)** ที่มุมขวาบน</li>
          </ol>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-teal-500 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </form>
    </div>
  );
}
