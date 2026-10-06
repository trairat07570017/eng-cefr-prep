"use client";

import React, { useState, useEffect } from "react";
import { Settings, Key, Database, Target, Save, CheckCircle2, Sliders } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [targetLevel, setTargetLevel] = useState("B2");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("eng_cefr_gemini_api_key", apiKey.trim());
      localStorage.setItem("eng_cefr_target_level", targetLevel);
      localStorage.setItem("eng_cefr_supabase_url", supabaseUrl.trim());
      localStorage.setItem("eng_cefr_supabase_key", supabaseKey.trim());

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert("ไม่สามารถบันทึกลง LocalStorage ได้");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-400" />
          <span>ตั้งค่าและเชื่อมต่อ (Settings & Sync)</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          ปรับแต่งระดับเป้าหมาย CEFR จัดการคีย์ Gemini AI และตั้งค่าการซิงค์ข้อมูลผ่าน Supabase Cloud
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Target Level Setting */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-base font-semibold text-white">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>ระดับเป้าหมาย CEFR ตามเกณฑ์ ก.ค.ศ.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                targetLevel === "B2"
                  ? "bg-blue-600/10 border-blue-500/50 text-white"
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
              <div>
                <span className="font-bold text-sm block text-white">ระดับ B2 (สำหรับครูทั่วไป)</span>
                <span className="text-xs text-slate-400 leading-relaxed block mt-0.5">
                  เกณฑ์ ก.ค.ศ. ระบุ &ldquo;สูงกว่า B1&rdquo; เหมาะสำหรับครูผู้สอนทุกกลุ่มสาระที่ไม่ใช่วิชาภาษาต่างประเทศ
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                targetLevel === "C1"
                  ? "bg-blue-600/10 border-blue-500/50 text-white"
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
              <div>
                <span className="font-bold text-sm block text-white">ระดับ C1 (สำหรับครูภาษาอังกฤษ)</span>
                <span className="text-xs text-slate-400 leading-relaxed block mt-0.5">
                  เกณฑ์ ก.ค.ศ. ระบุ &ldquo;สูงกว่า B2&rdquo; สำหรับครูผู้สอนกลุ่มสาระการเรียนรู้ภาษาต่างประเทศ
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-base font-semibold text-white">
            <Key className="w-5 h-5 text-amber-400" />
            <span>Gemini API Key (กำหนดเองได้)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            ระบบสามารถใช้ API Key ส่วนกลางของ Server ได้โดยตรง หรือหากคุณต้องการใส่ Gemini API Key
            ส่วนตัวของคุณ สามารถวางที่นี่ได้ (คีย์จะถูกบันทึกไว้อย่างปลอดภัยในเบราว์เซอร์ของคุณ)
          </p>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Supabase Sync */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-base font-semibold text-white">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>ซิงค์ข้ามอุปกรณ์ด้วย Supabase Cloud (ไม่บังคับ)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            หากต้องการให้ข้อมูลคำศัพท์ซิงค์ตรงกันระหว่าง iPhone, iPad และ PC
            สามารถสร้างโปรเจกต์ Supabase ฟรีและนำ URL กับ Anon Key มาวางได้
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
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
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
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>
      </form>
    </div>
  );
}
