"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Activity, Lightbulb, LineChart, ShieldCheck, 
  Crosshair, CalendarDays, Users, Settings, Sparkles, RotateCcw,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const { isDemoMode, setDemoMode } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleReset = () => {
    if (confirm("This will clear all your local analysis data and profile. Continue?")) {
      localStorage.clear();
      window.location.href = "/onboarding";
    }
  };

  return (
    <motion.aside
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "bg-background border-r border-border flex flex-col h-full shrink-0 z-40 select-none relative",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo Header */}
      <div className={cn(
        "flex items-center h-14 border-b border-border shrink-0 px-3",
        collapsed ? "justify-center" : "gap-3 px-5"
      )}>
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-foreground" />
        </div>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap overflow-hidden"
          >
            Expense<span className="text-accent italic">Autopsy</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar-hidden">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed ? (
              <h4 className="px-3 text-[10px] font-bold text-muted uppercase tracking-widest font-mono mb-2">
                {section.title}
              </h4>
            ) : (
              <div className="w-full flex justify-center my-2">
                <div className="w-4 h-[1px] bg-foreground/10" />
              </div>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center rounded-lg text-sm transition-all duration-200 group/item relative overflow-hidden",
                      collapsed ? "justify-center px-0 py-3 mx-1" : "gap-3 px-3 py-2",
                      isActive 
                        ? "text-accent bg-accent/10 font-bold" 
                        : "text-secondary font-medium hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    {isActive && (
                      <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-r-md" />
                    )}
                    <item.icon
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-accent" : "text-muted group-hover/item:text-foreground"
                      )}
                      size={collapsed ? 20 : 18}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {!collapsed && (
                      <span className="whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}

              {section.title === "SYSTEM" && (
                <button
                  onClick={handleReset}
                  title={collapsed ? "Reset App" : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-sm text-danger font-medium hover:bg-danger/10 transition-all duration-200 group/reset border border-transparent hover:border-danger/20 w-full",
                    collapsed ? "justify-center py-3 mx-1 mt-2" : "gap-3 px-3 py-2 mt-2"
                  )}
                >
                  <RotateCcw className="shrink-0 text-danger/70 group-hover/reset:text-danger" size={collapsed ? 20 : 18} />
                  {!collapsed && <span>Reset App</span>}
                </button>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* System Mode Footer */}
      <AnimatePresence mode="wait">
        {!collapsed ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-3 border-t border-border shrink-0"
          >
            <div className="p-3 bg-surface rounded-xl border border-border flex flex-col gap-1.5 overflow-hidden relative group/status">
              <span className="text-[10px] text-muted font-mono font-bold uppercase tracking-widest whitespace-nowrap">System Mode</span>
              <div className="flex items-center gap-2 text-sm font-bold font-sans">
                {isDemoMode ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                    <span className="text-accent uppercase tracking-tight text-xs">DEMO ACTIVE</span>
                    <button 
                      onClick={() => setDemoMode(false)}
                      className="absolute right-2 top-2 opacity-0 group-hover/status:opacity-100 transition-opacity text-[8px] bg-danger/20 text-danger px-2 py-0.5 rounded border border-danger/30 font-black"
                    >
                      EXIT
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-success shrink-0 animate-pulse shadow-[0_0_8px_rgba(14,203,129,0.4)]" />
                    <span className="text-foreground font-bold whitespace-nowrap text-xs uppercase tracking-wider">LIVE AUDIT</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 border-t border-border shrink-0 flex justify-center"
          >
            <div className={cn(
              "w-3 h-3 rounded-full shrink-0 animate-pulse",
              isDemoMode 
                ? "bg-accent shadow-[0_0_8px_rgba(240,185,11,0.4)]"
                : "bg-success shadow-[0_0_8px_rgba(14,203,129,0.4)]"
            )} title={isDemoMode ? "Demo Mode" : "Live Audit"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:border-accent/40 hover:text-accent transition-all z-50 text-muted"
      >
        {collapsed ? (
          <PanelLeftOpen className="w-3 h-3" />
        ) : (
          <PanelLeftClose className="w-3 h-3" />
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
    </motion.aside>
  );
}
