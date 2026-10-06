"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./Sidebar";
import { Menu, X, GraduationCap, Sparkles } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);


  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 pt-safe">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              EngCEFR
              <span className="text-[9px] font-semibold uppercase px-1 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ว.PA
              </span>
            </span>
          </div>
        </Link>

        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          aria-label="Toggle menu"
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Slide-over Drawer for all items & info */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-72 bg-slate-950 border-l border-slate-800 p-5 flex flex-col shadow-2xl pt-safe pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-semibold text-slate-200 text-sm">เมนูทั้งหมด</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col flex-1 truncate">
                      <span className="truncate">{item.name}</span>
                      <span className="text-[11px] text-slate-500 truncate">{item.subtitle}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>เกณฑ์คะแนน ว.PA (ก.ค.ศ.)</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ครูทั่วไป: <strong className="text-slate-200">B2 ขึ้นไป</strong><br />
                ครูภาษาอังกฤษ: <strong className="text-slate-200">C1 ขึ้นไป</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar for iOS thumb reachability */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-40 pb-safe">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 h-full rounded-lg transition-colors py-1 ${
                  isActive ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] truncate max-w-[60px] text-center">
                  {item.subtitle.split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
