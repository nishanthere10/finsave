"use client";

import { Flame, CalendarDays, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

const ACTIVITY = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  state: i > 25 ? "pending" : i % 8 === 0 ? "missed" : "active",
}));

const STREAK_HISTORY = [
  { month: "February", streak: 18, best: false },
  { month: "March",    streak: 26, best: false },
  { month: "April",   streak: 12, best: false },
];

export default function StreaksPage() {
  const currentStreak = 12;
  const longestStreak = 41;
  const daysToRecord = longestStreak - currentStreak;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">

      {/* Header */}
      <div className="mb-6">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Progress</div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Streaks</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Consistency is the only cheat code. Don't break the chain.
        </p>
      </div>

      {/* Motivational Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0B0B0B] text-white rounded-2xl p-6 flex items-center justify-between overflow-hidden relative"
      >
        <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-2 bottom-0 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Motivation</p>
          <p className="text-lg font-bold text-white leading-snug">
            {daysToRecord > 0
              ? `You're ${daysToRecord} days away from your all-time record.`
              : "You've beaten your all-time record! 🔥"}
          </p>
          <p className="text-[10px] text-white/40 mt-1 font-mono">Current: {currentStreak}d &nbsp;•&nbsp; Record: {longestStreak}d</p>
        </div>
        <TrendingUp className="w-10 h-10 text-white/20 shrink-0" />
      </motion.div>

      {/* Stat Cards */}
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex-1 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex items-center justify-between border-l-4 border-l-orange-400 hover:-translate-y-0.5 transition-all"
        >
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Current Streak</div>
            <div className="text-4xl font-bold text-black font-mono">{currentStreak} <span className="text-xl text-gray-400 font-sans">Days</span></div>
          </div>
          <Flame className="w-10 h-10 text-orange-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex-1 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex items-center justify-between border-l-4 border-l-[#0E9F6E] hover:-translate-y-0.5 transition-all"
        >
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Longest Streak</div>
            <div className="text-4xl font-bold text-black font-mono">{longestStreak} <span className="text-xl text-gray-400 font-sans">Days</span></div>
          </div>
          <Award className="w-10 h-10 text-[#0E9F6E]" />
        </motion.div>
      </div>

      {/* 30-Day Activity Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">30-Day Activity — April 2026</h3>
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#0E9F6E]" />
              <span className="text-[10px] text-gray-400 font-bold">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-[10px] text-gray-400 font-bold">Missed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
              <span className="text-[10px] text-gray-400 font-bold">Pending</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {ACTIVITY.map(({ day, state }) => (
            <div key={day} className="relative group">
              <div
                className={`w-10 h-10 rounded-lg hover:scale-110 transition-transform shadow-sm flex items-center justify-center text-[9px] font-bold cursor-default ${
                  state === "active"
                    ? "bg-[#0E9F6E] border border-green-600 text-white"
                    : state === "missed"
                    ? "bg-red-500 border border-red-600 text-white"
                    : "bg-gray-50 border border-gray-100 text-gray-300"
                }`}
              >
                {day}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded whitespace-nowrap font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Apr {day} — {state === "active" ? "✓ On Track" : state === "missed" ? "✗ Missed" : "Upcoming"}
              </div>
            </div>
          ))}
        </div>

        {/* Week labels */}
        <div className="grid grid-cols-4 mt-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
          <span>Week 1 (Apr 1–7)</span>
          <span>Week 2 (Apr 8–14)</span>
          <span>Week 3 (Apr 15–21)</span>
          <span>Week 4 (Apr 22–30)</span>
        </div>
      </motion.div>

      {/* Streak History Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8"
      >
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Streak History</h3>
        <div className="space-y-3">
          {STREAK_HISTORY.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-gray-300" />
                <span className="text-sm font-bold text-gray-700">{row.month}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0E9F6E] rounded-full transition-all duration-1000"
                    style={{ width: `${(row.streak / longestStreak) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-black font-mono text-black w-10 text-right">{row.streak}d</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
