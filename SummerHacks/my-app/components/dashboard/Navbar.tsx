"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

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
    <header className="h-14 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 shrink-0 z-30">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Link href="/dashboard" className="text-xs text-muted hover:text-foreground transition-colors font-medium">
          Home
        </Link>
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-muted shrink-0" />
            {i === segments.length - 1 ? (
              <span className="text-xs text-foreground font-bold tracking-wide">
                {pageLabels[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            ) : (
              <Link
                href={`/${segments.slice(0, i + 1).join("/")}`}
                className="text-xs text-muted hover:text-foreground transition-colors font-medium"
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
          className={cn(
            "flex items-center gap-2 rounded-lg border transition-all duration-300 cursor-pointer",
            searchOpen
              ? "w-60 px-3 py-1.5 border-accent/50 bg-card shadow-[0_0_15px_rgba(240,185,11,0.1)]"
              : "w-auto px-2.5 py-1.5 border-border bg-card/50 hover:bg-card hover:border-border"
          )}
        >
          <Search className={cn("w-3.5 h-3.5 shrink-0", searchOpen ? "text-accent" : "text-muted")} />
          {searchOpen ? (
            <input
              autoFocus
              placeholder="Search protocol..."
              className="text-xs bg-transparent outline-none flex-1 text-foreground placeholder-muted font-mono"
              onBlur={() => setSearchOpen(false)}
            />
          ) : (
            <>
              <span className="text-[10px] text-muted font-bold tracking-wider uppercase hidden sm:inline">Search</span>
              <div className="hidden sm:flex items-center gap-0.5 ml-1">
                <kbd className="px-1 py-0.5 bg-background rounded text-[9px] text-muted font-mono leading-none border border-border">⌘</kbd>
                <kbd className="px-1 py-0.5 bg-background rounded text-[9px] text-muted font-mono leading-none border border-border">K</kbd>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors text-muted hover:text-foreground relative group">
          <Bell className="w-4 h-4 group-hover:text-accent transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border-2 border-background" />
        </button>

        <div className="w-px h-6 bg-foreground/10 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-lg border border-border",
                userButtonPopoverCard: "bg-card border-border",
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
