"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  BookOpenCheck,
  PenTool,
  BookMarked,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const navItems = [
  {
    name: "อ่านข่าวรายวัน",
    subtitle: "Daily Reader",
    href: "/",
    icon: Newspaper,
    badge: "1-2 เรื่อง",
  },
  {
    name: "คลังคำศัพท์ & SRS",
    subtitle: "Vocabulary Bank",
    href: "/vocab",
    icon: BookOpenCheck,
  },
  {
    name: "ห้องฝึกเขียน Essay",
    subtitle: "Writing Sandbox",
    href: "/writing",
    icon: PenTool,
    badge: "EduSynch",
  },
  {
    name: "ฝึกการอ่านจับใจความ",
    subtitle: "Reading Practice",
    href: "/reading",
    icon: BookMarked,
  },
  {
    name: "ตั้งค่าและเชื่อมต่อ",
    subtitle: "Settings & Sync",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 relative select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80 h-16">
        <Link
          href="/"
          className={`flex items-center gap-3 overflow-hidden ${
            collapsed ? "justify-center w-full" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                EngCEFR
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  ว.PA
                </span>
              </span>
              <span className="text-xs text-slate-400 truncate">
                ฝึกสอบ EduSynch B2/C1
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? `${item.name} (${item.subtitle})` : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                }`}
              />

              {!collapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <div className="flex flex-col truncate">
                    <span className="text-slate-200 truncate group-hover:text-white">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {item.subtitle}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 ml-2">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Target Box & Collapse Toggle */}
      <div className="p-3 border-t border-slate-800/80 space-y-3">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>เป้าหมายลดเวลา ว.PA</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              เป้าหมาย: <strong className="text-slate-200">CEFR B2</strong> (ครูทั่วไป) หรือ{" "}
              <strong className="text-slate-200">C1</strong> (ครูภาษา)
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
          title={collapsed ? "ขยายแถบเมนู" : "ย่อแถบเมนู"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>ย่อเมนูด้านข้าง</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
