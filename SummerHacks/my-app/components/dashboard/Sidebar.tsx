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
        "bg-background border-r border-border flex flex-col h-full shrink-0 z-40 select-none relative",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo Header */}
      <div className={cn(
        "flex items-center h-14 border-b border-border/50 shrink-0 px-3",
        collapsed ? "justify-center" : "gap-3 px-5"
      )}>
        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-background" />
        </div>
        {!collapsed && (
          <span className="text-sm font-serif font-bold text-foreground tracking-tight whitespace-nowrap overflow-hidden">
            ExpenseAutopsy
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 custom-scrollbar-hidden">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest font-sans mb-1.5">
                {section.title}
              </h4>
            )}
            {collapsed && (
              <div className="w-full flex justify-center my-1">
                <div className="w-6 h-px bg-border" />
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
                        ? "text-accent bg-accent/10 font-bold shadow-sm"
                        : "text-muted-foreground font-medium hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-md" />
                    )}
                    {isActive && collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-md" />
                    )}
                    <item.icon
                      className={cn(
                        "shrink-0",
                        isActive ? "text-accent" : "text-muted-foreground group-hover/item:text-foreground"
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive font-medium hover:bg-destructive/10 transition-all duration-200 group/reset mt-2 border border-transparent hover:border-destructive/20"
                >
                  <RotateCcw className="shrink-0 text-destructive/80 group-hover/reset:text-destructive" size={18} />
                  <span>Reset App</span>
                </button>
              )}
              {section.title === "SYSTEM" && collapsed && (
                <button
                  onClick={handleReset}
                  title="Reset App"
                  className="w-full flex justify-center py-2.5 mx-1 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
                >
                  <RotateCcw className="text-destructive/80" size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* System Mode Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-border/50 shrink-0">
          <div className="p-3 bg-secondary/30 rounded-xl border border-border flex flex-col gap-1.5 overflow-hidden relative group/status">
            <span className="text-[10px] text-muted-foreground font-sans font-bold uppercase tracking-wider whitespace-nowrap">System Mode</span>
            <div className="flex items-center gap-2 text-sm font-bold font-sans">
              {isDemoMode ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="text-amber-500 uppercase tracking-tight text-xs">DEMO ACTIVE</span>
                  <button 
                    onClick={() => setDemoMode(false)}
                    className="absolute right-2 top-2 opacity-0 group-hover/status:opacity-100 transition-opacity text-[8px] bg-destructive/10 text-destructive px-2 py-0.5 rounded border border-destructive/20 font-black"
                  >
                    EXIT
                  </button>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse shadow-[0_0_8px_rgba(44,94,58,0.4)]" />
                  <span className="text-foreground font-bold whitespace-nowrap text-xs">LIVE AUDIT</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="p-2 border-t border-border/50 shrink-0 flex justify-center">
          <div className={cn(
            "w-3 h-3 rounded-full shrink-0 animate-pulse",
            isDemoMode 
              ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              : "bg-accent shadow-[0_0_8px_rgba(44,94,58,0.4)]"
          )} title={isDemoMode ? "Demo Mode" : "Live Audit"} />
        </div>
      )}

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all z-50 group/toggle"
      >
        {collapsed ? (
          <PanelLeftOpen className="w-3 h-3 text-muted-foreground group-hover/toggle:text-foreground" />
        ) : (
          <PanelLeftClose className="w-3 h-3 text-muted-foreground group-hover/toggle:text-foreground" />
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
