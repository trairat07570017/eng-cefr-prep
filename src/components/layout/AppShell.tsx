"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Load saved collapsed preference
    try {
      const saved = localStorage.getItem("eng_cefr_sidebar_collapsed");
      if (saved) setCollapsed(saved === "true");
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("eng_cefr_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Desktop/iPad Left Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={handleToggleCollapse} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Desktop TopBar */}
        <TopBar />

        {/* Mobile Header and Drawer */}
        <MobileNav />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
