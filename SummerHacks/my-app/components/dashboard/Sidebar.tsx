"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Activity, 
  Lightbulb, 
  LineChart, 
  ShieldCheck, 
  Crosshair, 
  TrendingUp, 
  CalendarDays, 
  Users, 
  Settings,
  Sparkles,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { useState } from "react";

const NAV_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Autopsy", href: "/analysis", icon: Activity },
      { label: "Insights", href: "/insights", icon: Lightbulb },
      { label: "Money Mirror", href: "/money-mirror", icon: LineChart },
    ],
  },
  {
    title: "COMMITMENT",
    items: [
      { label: "Set Goal", href: "/commit", icon: Crosshair },
      { label: "Verify", href: "/verify", icon: ShieldCheck },
    ],
  },
  {
    title: "PROGRESS",
    items: [
      { label: "Streaks", href: "/streaks", icon: CalendarDays },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { label: "Network", href: "/network", icon: Users },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDemoMode, setDemoMode } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleReset = () => {
    if (confirm("This will clear all your local analysis data and profile. Continue?")) {
      localStorage.clear();
      window.location.href = "/onboarding";
    }
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full shrink-0 z-40 select-none relative",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo Header */}
      <div className={cn(
        "flex items-center h-14 border-b border-gray-100 shrink-0 px-3",
        collapsed ? "justify-center" : "gap-3 px-5"
      )}>
        <div className="w-8 h-8 bg-[#0B0B0B] rounded-lg flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-black tracking-tight whitespace-nowrap overflow-hidden">
            ExpenseAutopsy
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 custom-scrollbar-hidden">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest font-sans mb-1.5">
                {section.title}
              </h4>
            )}
            {collapsed && (
              <div className="w-full flex justify-center my-1">
                <div className="w-6 h-px bg-gray-200" />
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center rounded-lg text-sm transition-all duration-200 group/item relative overflow-hidden",
                      collapsed ? "justify-center px-0 py-2.5 mx-1" : "gap-3 px-3 py-2",
                      isActive 
                        ? "text-green-600 bg-green-50 font-bold shadow-sm" 
                        : "text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-600 rounded-r-md" />
                    )}
                    {isActive && collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-600 rounded-r-md" />
                    )}
                    <item.icon
                      className={cn(
                        "shrink-0",
                        isActive ? "text-green-600" : "text-gray-400 group-hover/item:text-gray-900"
                      )}
                      size={collapsed ? 20 : 18}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {!collapsed && (
                      <span className="whitespace-nowrap transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
              {section.title === "SYSTEM" && !collapsed && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 font-medium hover:bg-red-50 transition-all duration-200 group/reset mt-2 border border-transparent hover:border-red-100"
                >
                  <RotateCcw className="shrink-0 text-red-400 group-hover/reset:text-red-600" size={18} />
                  <span>Reset App</span>
                </button>
              )}
              {section.title === "SYSTEM" && collapsed && (
                <button
                  onClick={handleReset}
                  title="Reset App"
                  className="w-full flex justify-center py-2.5 mx-1 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                >
                  <RotateCcw className="text-red-400" size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* System Mode Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-100 shrink-0">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1.5 overflow-hidden relative group/status">
            <span className="text-[10px] text-gray-500 font-sans font-bold uppercase tracking-wider whitespace-nowrap">System Mode</span>
            <div className="flex items-center gap-2 text-sm font-bold font-sans">
              {isDemoMode ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span className="text-amber-600 uppercase tracking-tight text-xs">DEMO ACTIVE</span>
                  <button 
                    onClick={() => setDemoMode(false)}
                    className="absolute right-2 top-2 opacity-0 group-hover/status:opacity-100 transition-opacity text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 font-black"
                  >
                    EXIT
                  </button>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-gray-900 font-bold whitespace-nowrap text-xs">LIVE AUDIT</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="p-2 border-t border-gray-100 shrink-0 flex justify-center">
          <div className={cn(
            "w-3 h-3 rounded-full shrink-0 animate-pulse",
            isDemoMode 
              ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
          )} title={isDemoMode ? "Demo Mode" : "Live Audit"} />
        </div>
      )}

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:bg-gray-50 transition-all z-50 group/toggle"
      >
        {collapsed ? (
          <PanelLeftOpen className="w-3 h-3 text-gray-400 group-hover/toggle:text-gray-700" />
        ) : (
          <PanelLeftClose className="w-3 h-3 text-gray-400 group-hover/toggle:text-gray-700" />
        )}
      </button>

      <style jsx global>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}
