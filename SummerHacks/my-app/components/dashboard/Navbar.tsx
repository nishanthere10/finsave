"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("ea_name") || 
                   localStorage.getItem("user_name") || 
                   localStorage.getItem("ea_user_name") || "User";
      setUserName(name);
      setUserInitial(name.charAt(0).toUpperCase());
    }
  }, []);

  // ⌘K shortcut handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(prev => !prev);
    }
    if (e.key === "Escape") setSearchOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const pageLabels: Record<string, string> = {
    dashboard: "Dashboard",
    analysis: "Autopsy",
    insights: "Insights",
    "money-mirror": "Money Mirror",
    commit: "Set Goal",
    verify: "Verify",
    streaks: "Streaks",
    network: "Network",
    settings: "Settings",
  };

  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-14 bg-background/90 backdrop-blur-xl border-b border-border/70 flex items-center justify-between px-6 shrink-0 z-30">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
          Home
        </Link>
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            {i === segments.length - 1 ? (
              <span className="text-xs text-foreground font-bold tracking-wide">
                {pageLabels[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            ) : (
              <Link
                href={`/${segments.slice(0, i + 1).join("/")}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {pageLabels[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div
          onClick={() => setSearchOpen(true)}
          className={`flex items-center gap-2 rounded-lg border transition-all duration-300 cursor-pointer ${
            searchOpen
              ? "w-60 px-3 py-1.5 border-border bg-card shadow-sm"
              : "w-auto px-2.5 py-1.5 border-transparent bg-secondary/50 hover:bg-secondary"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {searchOpen ? (
            <input
              autoFocus
              placeholder="Search pages..."
              className="text-xs bg-transparent outline-none flex-1 text-foreground placeholder-muted-foreground"
              onBlur={() => setSearchOpen(false)}
            />
          ) : (
            <>
              <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">Search</span>
              <div className="hidden sm:flex items-center gap-0.5 ml-1">
                <kbd className="px-1 py-0.5 bg-background rounded text-[9px] text-muted-foreground font-mono leading-none border border-border">⌘</kbd>
                <kbd className="px-1 py-0.5 bg-background rounded text-[9px] text-muted-foreground font-mono leading-none border border-border">K</kbd>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-secondary transition-colors cursor-default group">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-[11px] font-bold shadow-sm ring-2 ring-background group-hover:ring-accent/30 transition-all select-none">
            {userInitial}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs font-bold text-foreground leading-tight">{userName}</span>
            <span className="text-[10px] text-muted-foreground leading-tight font-mono">Sepolia Testnet</span>
          </div>
        </div>
      </div>
    </header>
  );
}
